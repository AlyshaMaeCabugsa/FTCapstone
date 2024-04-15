const socket = require('socket.io-client')('http://localhost:8080', {
  transports: ['websocket'], // Force WebSocket transport for the connection
});

socket.on('connect', () => {
  console.log('Connected to the server.');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Listen for the new inspection alert
socket.on('newInspectionAlert', (data) => {
  console.log('New inspection alert received:', data);
});

// Listen for recent inspection updates
socket.on('recentInspectionUpdate', (data) => {
  console.log('Recent inspection update received:', data);
});

// Listen for admin notifications
socket.on('notifyAdmin', (data) => {
  console.log('Admin notification received:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server.');
});

// Include any other event listeners for events you expect to be emitted by your server


