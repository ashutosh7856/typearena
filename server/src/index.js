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

// REST API Routes

// Get leaderboard
app.get('/api/leaderboards/:type', async (req, res) => {
  try {
    const { type } = req.params; // allTime, daily, weekly, monthly
    
    // Fetch top users by avgWPM
    const usersSnapshot = await db.collection('users')
      .orderBy('stats.avgWPM', 'desc')
      .limit(100)
      .get();
    
    const leaderboard = [];
    usersSnapshot.forEach((doc, index) => {
      const data = doc.data();
      leaderboard.push({
        rank: index + 1,
        userId: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        avgWPM: data.stats?.avgWPM || 0,
        bestWPM: data.stats?.bestWPM || 0,
        avgAccuracy: data.stats?.avgAccuracy || 0,
        totalMatches: data.stats?.totalMatches || 0
      });
    });
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
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
      .get();
    
    const tournaments = [];
    snapshot.forEach(doc => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
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
      .get();
    
    const rooms = [];
    roomsSnapshot.forEach(doc => {
      rooms.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching public rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
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
