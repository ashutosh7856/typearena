import { getRandomWords } from '../utils/words.js';

export class Room {
  constructor(id, hostId, config) {
    this.id = id;
    this.hostId = hostId;
    this.config = {
      difficulty: config.difficulty || 'medium',
      duration: config.duration || 60,
      ...config
    };
    this.players = new Map(); // playerId -> { id, name, wpm, progress, socket }
    this.status = 'waiting'; // waiting, playing, finished
    this.wordList = '';
    this.startTime = null;
    this.endTime = null;
  }

  addPlayer(player) {
    this.players.set(player.id, {
      ...player,
      wpm: 0,
      progress: 0,
      accuracy: 100,
      finished: false
    });
    this.broadcast({ type: 'PLAYER_JOINED', payload: { player: { id: player.id, name: player.name } } });
    this.broadcastRoomState();
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    this.broadcast({ type: 'PLAYER_LEFT', payload: { playerId } });
    this.broadcastRoomState();
    
    if (this.players.size === 0) {
      return true; // Room empty
    }
    
    if (playerId === this.hostId) {
      // Assign new host
      this.hostId = this.players.keys().next().value;
      this.broadcast({ type: 'NEW_HOST', payload: { hostId: this.hostId } });
    }
    return false;
  }

  startGame() {
    if (this.status !== 'waiting') return;
    
    this.status = 'playing';
    this.wordList = getRandomWords(this.config.difficulty);
    this.startTime = Date.now() + 3000; // 3s countdown
    this.endTime = this.startTime + (this.config.duration * 1000);

    this.broadcast({
      type: 'GAME_START',
      payload: {
        startTime: this.startTime,
        wordList: this.wordList,
        duration: this.config.duration
      }
    });

    // End game timeout
    setTimeout(() => {
      this.endGame();
    }, (this.config.duration * 1000) + 3000);
  }

  updatePlayerProgress(playerId, data) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.wpm = data.wpm;
    player.progress = data.progress;
    player.accuracy = data.accuracy;
    
    this.broadcast({
      type: 'PLAYER_UPDATE',
      payload: {
        playerId,
        wpm: player.wpm,
        progress: player.progress,
        accuracy: player.accuracy
      }
    });
  }

  endGame() {
    this.status = 'finished';
    const leaderboard = Array.from(this.players.values())
      .map(p => ({ id: p.id, name: p.name, wpm: p.wpm, accuracy: p.accuracy }))
      .sort((a, b) => b.wpm - a.wpm);

    this.broadcast({
      type: 'GAME_END',
      payload: { leaderboard }
    });
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    for (const player of this.players.values()) {
      if (player.socket.readyState === 1) {
        player.socket.send(data);
      }
    }
  }

  broadcastRoomState() {
    const playersList = Array.from(this.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      isHost: p.id === this.hostId
    }));
    
    this.broadcast({
      type: 'ROOM_STATE',
      payload: {
        id: this.id,
        status: this.status,
        config: this.config,
        players: playersList,
        hostId: this.hostId
      }
    });
  }
}
