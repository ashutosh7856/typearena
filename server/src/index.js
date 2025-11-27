import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, auth } from './config/firebaseAdmin.js';
import { RoomManager } from './game/RoomManager.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

console.log('Firebase Admin initialized successfully');

const roomManager = new RoomManager();

// Points calculation helpers
const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  easy: 1.5,
  medium: 2.0,
  hard: 3.0
};

const calculatePoints = (wpm, accuracy, duration, difficulty) => {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  const timeInMinutes = duration / 60;
  return Math.round(wpm * (accuracy / 100) * timeInMinutes * multiplier);
};

// REST API Routes

// Get leaderboard with time-period filtering
app.get('/api/leaderboards/:type', async (req, res) => {
  try {
    const { type } = req.params; // allTime, daily, weekly, monthly
    
    // Calculate date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let startDate = null;
    switch (type) {
      case 'daily':
        startDate = today;
        break;
      case 'weekly':
        startDate = thisWeek;
        break;
      case 'monthly':
        startDate = thisMonth;
        break;
      case 'allTime':
      default:
        startDate = null; // No filter
    }
    
    if (startDate) {
      // Time-period specific: Calculate from matches
      const matchesSnapshot = await db.collection('matches')
        .where('timestamp', '>=', startDate)
        .get()
        .catch(err => {
          console.error('Matches query error:', err);
          return { docs: [] };
        });
      
      // Group matches by user and sum points
      const userPoints = {};
      const userStats = {};
      
      matchesSnapshot.docs.forEach(doc => {
        const match = doc.data();
        const userId = match.userId;
        
        if (!userId) return;
        
        // Calculate points if not stored
        const points = match.points || 0;
        
        if (!userPoints[userId]) {
          userPoints[userId] = {
            totalPoints: 0,
            matches: 0,
            totalWPM: 0,
            bestWPM: 0,
            totalAccuracy: 0
          };
        }
        
        userPoints[userId].totalPoints += points;
        userPoints[userId].matches += 1;
        userPoints[userId].totalWPM += match.wpm || 0;
        userPoints[userId].bestWPM = Math.max(userPoints[userId].bestWPM, match.wpm || 0);
        userPoints[userId].totalAccuracy += match.accuracy || 0;
      });
      
      // Fetch user details for those with activity
      const leaderboard = [];
      const userIds = Object.keys(userPoints);
      
      for (const userId of userIds) {
        const userDoc = await db.collection('users').doc(userId).get().catch(() => null);
        if (!userDoc || !userDoc.exists) continue;
        
        const userData = userDoc.data();
        const stats = userPoints[userId];
        
        // Only include users with actual points in this period
        if (stats.totalPoints > 0) {
          leaderboard.push({
            userId,
            displayName: userData.displayName || 'Anonymous',
            photoURL: userData.photoURL || null,
            totalPoints: Math.round(stats.totalPoints),
            avgWPM: Math.round(stats.totalWPM / stats.matches),
            bestWPM: Math.round(stats.bestWPM),
            avgAccuracy: Math.round(stats.totalAccuracy / stats.matches),
            totalMatches: stats.matches
          });
        }
      }
      
      // Sort by period points
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
      
      // Add ranks
      leaderboard.forEach((player, index) => {
        player.rank = index + 1;
      });
      
      res.json(leaderboard.slice(0, 100)); // Top 100
      
    } else {
      // All-time: Use cumulative stats from users collection
      const usersSnapshot = await db.collection('users')
        .limit(100)
        .get()
        .catch(err => {
          console.error('Users query error:', err);
          return { docs: [] };
        });
      
      const leaderboard = [];
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.displayName) {
          const totalPoints = data.stats?.totalPoints || 0;
          const avgWPM = data.stats?.avgWPM || 0;
          
          if (totalPoints > 0 || avgWPM > 0) {
            leaderboard.push({
              userId: doc.id,
              displayName: data.displayName || 'Anonymous',
              photoURL: data.photoURL || null,
              totalPoints: Math.round(totalPoints),
              avgWPM: Math.round(avgWPM),
              bestWPM: Math.round(data.stats?.bestWPM || 0),
              avgAccuracy: Math.round(data.stats?.avgAccuracy || 0),
              totalMatches: data.stats?.totalMatches || 0
            });
          }
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
      
      res.json(leaderboard);
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(200).json([]);
  }
});

// Get user profile
app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user matches
app.get('/api/users/:userId/matches', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const matchesSnapshot = await db.collection('matches')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const matches = [];
    matchesSnapshot.forEach(doc => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get tournaments
app.get('/api/tournaments', async (req, res) => {
  try {
    const { status, isPublic } = req.query;
    let query = db.collection('tournaments');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (isPublic !== undefined) {
      query = query.where('isPublic', '==', isPublic === 'true');
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
      .catch(err => {
        console.error('Tournaments collection error:', err);
        return { docs: [], forEach: () => {} };
      });
    
    const tournaments = [];
    snapshot.forEach(doc => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(200).json([]); // Return empty array instead of crashing
  }
});

// Get tournament details
app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tournamentDoc = await db.collection('tournaments').doc(id).get();
    
    if (!tournamentDoc.exists) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    res.json({ id: tournamentDoc.id, ...tournamentDoc.data() });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

// Get public rooms
app.get('/api/rooms/public', async (req, res) => {
  try {
    const roomsSnapshot = await db.collection('publicRooms')
      .where('status', '==', 'waiting')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()
      .catch(err => {
        console.error('Public rooms collection error:', err);
        return { docs: [], forEach: () => {} };
      });
    
    const rooms = [];
    roomsSnapshot.forEach(doc => {
      rooms.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    res.status(200).json([]);
  }
});

// Start tournament
app.post('/api/tournaments/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }
    
    const tournamentRef = db.collection('tournaments').doc(id);
    const tournamentDoc = await tournamentRef.get();
    
    if (!tournamentDoc.exists) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    const tournament = tournamentDoc.data();
    
    // Only creator can start tournament
    if (tournament.createdBy !== userId) {
      return res.status(403).json({ error: 'Only the creator can start the tournament' });
    }
    
    if (tournament.status !== 'waiting') {
      return res.status(400).json({ error: 'Tournament already started or completed' });
    }
    
    if (!tournament.participants || tournament.participants.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 participants to start' });
    }
    
    // Update tournament status
    await tournamentRef.update({
      status: 'active',
      startedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Tournament started' });
  } catch (error) {
    console.error('Error starting tournament:', error);
    res.status(500).json({ error: 'Failed to start tournament' });
  }
});

// Delete tournament
app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('tournaments').doc(id).delete();
    res.json({ success: true, message: 'Tournament deleted' });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  let currentRoomId = null;
  let playerId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'CREATE_ROOM': {
          const { hostId, config } = data.payload;
          playerId = hostId;
          const room = roomManager.createRoom(hostId, config);
          currentRoomId = room.id;
          room.addPlayer({ id: hostId, name: data.payload.name, socket: ws });
          break;
        }
        
        case 'JOIN_ROOM': {
          const { roomId, player } = data.payload;
          playerId = player.id;
          try {
            const room = roomManager.joinRoom(roomId, { ...player, socket: ws });
            currentRoomId = roomId;
          } catch (error) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: { message: error.message } }));
          }
          break;
        }
        
        case 'START_GAME': {
          const room = roomManager.getRoom(currentRoomId);
          if (room && room.hostId === playerId) {
            room.startGame();
          }
          break;
        }
        
        case 'UPDATE_PROGRESS': {
          const room = roomManager.getRoom(currentRoomId);
          if (room) {
            room.updatePlayerProgress(playerId, data.payload);
          }
          break;
        }
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && playerId) {
      roomManager.removePlayer(currentRoomId, playerId);
    }
  });
});

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', firebase: 'connected' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
  console.log(`Firebase Admin SDK initialized`);
});
