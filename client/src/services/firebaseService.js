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
    // For now, we'll calculate leaderboards from user stats
    // In production, you might want to use Cloud Functions to maintain these
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('stats.avgWPM', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(usersQuery);
    const leaderboard = [];
    
    querySnapshot.forEach((doc, index) => {
      const userData = doc.data();
      leaderboard.push({
        rank: index + 1,
        userId: doc.id,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        avgWPM: userData.stats?.avgWPM || 0,
        bestWPM: userData.stats?.bestWPM || 0,
        avgAccuracy: userData.stats?.avgAccuracy || 0,
        totalMatches: userData.stats?.totalMatches || 0
      });
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
