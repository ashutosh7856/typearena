import { Room } from './Room.js';

export class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(hostId, config) {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = new Room(roomId, hostId, config);
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    if (room.status !== 'waiting') {
      throw new Error('Game already in progress');
    }
    room.addPlayer(player);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  removePlayer(roomId, playerId) {
    const room = this.rooms.get(roomId);
    if (room) {
      const isEmpty = room.removePlayer(playerId);
      if (isEmpty) {
        this.rooms.delete(roomId);
      }
    }
  }
}
