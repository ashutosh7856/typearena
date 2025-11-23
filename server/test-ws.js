import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connected to server');
  
  // Create a room
  const hostId = 'host123';
  ws.send(JSON.stringify({
    type: 'CREATE_ROOM',
    payload: {
      hostId,
      name: 'Host Player',
      config: { difficulty: 'easy', duration: 30 }
    }
  }));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
  
  if (message.type === 'ROOM_STATE' && message.payload.players.length === 1) {
    // Room created, now simulate another player joining
    console.log('Room created with ID:', message.payload.id);
  }
});
