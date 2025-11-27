import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import API_URL from '../config/api';
import { db } from '../firebase/firebase';

// Save match result to Firestore
export const saveMatchResult = async (userId, matchData) => {
  try {
    const matchRef = await addDoc(collection(db, 'matches'), {
      userId,
      ...matchData,
      timestamp: serverTimestamp()
    });

    // Update user stats
    await updateUserStats(userId, matchData);

    return matchRef.id;
  } catch (error) {
    console.error('Error saving match result:', error);
    throw error;
  }
};

// Update user statistics
export const updateUserStats = async (userId, matchData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const stats = userData.stats || {
      totalMatches: 0,
      avgWPM: 0,
      avgAccuracy: 0,
      bestWPM: 0,
      totalTimeTyped: 0
    };

    // Calculate new averages
    const newTotalMatches = stats.totalMatches + 1;
    const newAvgWPM = ((stats.avgWPM * stats.totalMatches) + matchData.wpm) / newTotalMatches;
    const newAvgAccuracy = ((stats.avgAccuracy * stats.totalMatches) + matchData.accuracy) / newTotalMatches;
    const newBestWPM = Math.max(stats.bestWPM, matchData.wpm);
    const newTotalTimeTyped = stats.totalTimeTyped + (matchData.duration || 0);

    await updateDoc(userRef, {
      'stats.totalMatches': newTotalMatches,
      'stats.avgWPM': Math.round(newAvgWPM),
      'stats.avgAccuracy': Math.round(newAvgAccuracy * 100) / 100,
      'stats.bestWPM': newBestWPM,
      'stats.totalTimeTyped': newTotalTimeTyped
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get user matches
export const getUserMatches = async (userId, limitCount = 50) => {
  try {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(matchesQuery);
    const matches = [];
    
    querySnapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    
    return matches;
  } catch (error) {
    console.error('Error fetching user matches:', error);
    throw error;
  }
};

// Create tournament
export const createTournament = async (tournamentData) => {
  try {
    const tournamentRef = await addDoc(collection(db, 'tournaments'), {
      ...tournamentData,
      createdAt: serverTimestamp(),
      status: 'waiting',
      participants: [tournamentData.createdBy],
      results: []
    });
    
    return tournamentRef.id;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
};

// Get tournaments
export const getTournaments = async (filters = {}) => {
  try {
    let tournamentQuery = collection(db, 'tournaments');
    
    if (filters.status) {
      tournamentQuery = query(tournamentQuery, where('status', '==', filters.status));
    }
    
    if (filters.isPublic !== undefined) {
      tournamentQuery = query(tournamentQuery, where('isPublic', '==', filters.isPublic));
    }
    
    tournamentQuery = query(
      tournamentQuery,
      orderBy('createdAt', 'desc'),
      limit(filters.limit || 50)
    );
    
    const querySnapshot = await getDocs(tournamentQuery);
    const tournaments = [];
    
    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    
    return tournaments;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

// Join tournament
export const joinTournament = async (tournamentId, userId) => {
  try {
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournamentSnap = await getDoc(tournamentRef);
    
    if (!tournamentSnap.exists()) {
      throw new Error('Tournament not found');
    }
    
    const tournament = tournamentSnap.data();
    
    if (tournament.participants.includes(userId)) {
      throw new Error('Already joined this tournament');
    }
    
    if (tournament.config.maxPlayers && tournament.participants.length >= tournament.config.maxPlayers) {
      throw new Error('Tournament is full');
    }
    
    await updateDoc(tournamentRef, {
      participants: [...tournament.participants, userId]
    });
    
    return true;
  } catch (error) {
    console.error('Error joining tournament:', error);
    throw error;
  }
};

// Get leaderboard
export const getLeaderboard = async (type = 'allTime', category = null) => {
  try {
    // Fetch all users (can't use orderBy if some users lack totalPoints)
    const usersQuery = query(
      collection(db, 'users'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(usersQuery);
    const leaderboard = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const totalPoints = userData.stats?.totalPoints || 0;
      const avgWPM = userData.stats?.avgWPM || 0;
      
      // Only include users with stats
      if (totalPoints > 0 || avgWPM > 0) {
        leaderboard.push({
          userId: doc.id,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          totalPoints,
          avgWPM,
          bestWPM: userData.stats?.bestWPM || 0,
          avgAccuracy: userData.stats?.avgAccuracy || 0,
          totalMatches: userData.stats?.totalMatches || 0
        });
      }
    });
    
    // Sort by totalPoints, fallback to avgWPM
    leaderboard.sort((a, b) => {
      const aScore = a.totalPoints > 0 ? a.totalPoints : a.avgWPM;
      const bScore = b.totalPoints > 0 ? b.totalPoints : b.avgWPM;
      return bScore - aScore;
    });
    
    // Add ranks
    leaderboard.forEach((player, index) => {
      player.rank = index + 1;
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// ==================== NEW FUNCTIONS FOR POINTS SYSTEM ====================

// Get lesson completion for a user
export const getLessonCompletion = async (userId, lessonId) => {
  try {
    const completionQuery = query(
      collection(db, 'lessonCompletions'),
      where('userId', '==', userId),
      where('lessonId', '==', lessonId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(completionQuery);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching lesson completion:', error);
    // Return null instead of throwing to allow graceful handling
    return null;
  }
};

// Save match result with points calculation
export const saveMatchWithPoints = async (userId, matchData) => {
  try {
    const { category, difficulty, wpm, accuracy, duration, points, lessonId } = matchData;
    
    // Save to matches collection with points
    const matchRef = await addDoc(collection(db, 'matches'), {
      userId,
      mode: 'single',
      category,
      difficulty,
      lessonId,
      wpm,
      accuracy,
      duration,
      points: points || 0,
      timestamp: serverTimestamp()
    });

    // Update user stats including points
    await updateUserStatsWithPoints(userId, matchData);
    
    // Save lesson completion
    if (lessonId) {
      await saveLessonCompletion(userId, matchData);
    }

    return matchRef.id;
  } catch (error) {
    console.error('Error saving match result with points:', error);
    throw error;
  }
};

// Save lesson completion record
const saveLessonCompletion = async (userId, matchData) => {
  try {
    const { lessonId, category, difficulty, wpm, accuracy, points } = matchData;
    
    await addDoc(collection(db, 'lessonCompletions'), {
      userId,
      lessonId,
      category,
      difficulty,
      wpm,
      accuracy,
      points,
      timestamp: Date.now(),
      canRetry: wpm < 35
    });
  } catch (error) {
    console.error('Error saving lesson completion:', error);
    // Don't throw - completion tracking is not critical
  }
};

// Update user stats with points
const updateUserStatsWithPoints = async (userId, matchData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const stats = userData.stats || {
      totalMatches: 0,
      avgWPM: 0,
      avgAccuracy: 0,
      bestWPM: 0,
      totalTimeTyped: 0,
      totalPoints: 0
    };

    // Calculate new averages
    const newTotalMatches = stats.totalMatches + 1;
    const newAvgWPM = ((stats.avgWPM * stats.totalMatches) + matchData.wpm) / newTotalMatches;
    const newAvgAccuracy = ((stats.avgAccuracy * stats.totalMatches) + matchData.accuracy) / newTotalMatches;
    const newBestWPM = Math.max(stats.bestWPM, matchData.wpm);
    const newTotalTimeTyped = stats.totalTimeTyped + (matchData.duration || 0);
    const newTotalPoints = (stats.totalPoints || 0) + (matchData.points || 0);

    await updateDoc(userRef, {
      'stats.totalMatches': newTotalMatches,
      'stats.avgWPM': Math.round(newAvgWPM),
      'stats.avgAccuracy': Math.round(newAvgAccuracy * 100) / 100,
      'stats.bestWPM': newBestWPM,
      'stats.totalTimeTyped': newTotalTimeTyped,
      'stats.totalPoints': newTotalPoints
    });
  } catch (error) {
    console.error('Error updating user stats with points:', error);
    throw error;
  }
};

// Start a tournament
export const startTournament = async (tournamentId, userId) => {
  try {
    const response = await fetch(`${API_URL}/api/tournaments/${tournamentId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start tournament');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error starting tournament:', error);
    throw error;
  }
};

// Submit tournament score
export const submitTournamentScore = async (tournamentId, userId, scoreData) => {
  try {
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournamentDoc = await getDoc(tournamentRef);
    
    if (!tournamentDoc.exists()) {
      throw new Error('Tournament not found');
    }
    
    const tournament = tournamentDoc.data();
    const results = tournament.results || [];
    
    // Add or update user's score
    const existingIndex = results.findIndex(r => r.userId === userId);
    const newScore = {
      userId,
      wpm: scoreData.wpm,
      accuracy: scoreData.accuracy,
      timestamp: serverTimestamp()
    };
    
    if (existingIndex >= 0) {
      results[existingIndex] = newScore;
    } else {
      results.push(newScore);
    }
    
    // Sort by WPM
    results.sort((a, b) => b.wpm - a.wpm);
    
    // Check if all participants have submitted
    const allSubmitted = tournament.participants.every(
      participantId => results.some(r => r.userId === participantId)
    );
    
    await updateDoc(tournamentRef, {
      results,
      ...(allSubmitted ? { status: 'completed', completedAt: serverTimestamp() } : {})
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting tournament score:', error);
    throw error;
  }
};
