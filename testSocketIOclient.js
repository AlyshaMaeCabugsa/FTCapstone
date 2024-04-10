const socket = require('socket.io-client')('http://localhost:8080', {
  transports: ['websocket'], // Add this line to force WebSockets
});

socket.on('connect', () => {
  console.log('Connected to the server.');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('establishmentCount', (count) => {
  console.log(`Total Establishments: ${count}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server.');
});
