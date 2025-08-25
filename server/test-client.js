// server/test-client.js
const io = require('socket.io-client');

// replace with a valid JWT token (login to get one)
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWFlNWY5MGQzYTg2MzVlNmU2NGE0ZCIsImlhdCI6MTc1NjEwMDUzOCwiZXhwIjoxNzU2NzA1MzM4fQ.UwaGxogE8PfaTIXRPz2HmyNJwjOoxS662bEKHiuXA7s';

// replace with your server URL
const URL = 'http://localhost:4000';

const socket = io(URL, {
  auth: { token: TOKEN },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('connected as', socket.id);

  // send a test message after connecting
  setTimeout(() => {
    socket.emit('message:send', { to: '68ab4d706321f550b5a34d14', text: 'Hi from test client', tempId: 't1' }, (ack) => {
      console.log('send ack:', ack);
    });
  }, 1000);

  // send typing start/stop
  setTimeout(() => socket.emit('typing:start', { to: 'RECEIVER_USER_ID' }), 1500);
  setTimeout(() => socket.emit('typing:stop', { to: 'RECEIVER_USER_ID' }), 3000);
});

socket.on('connect_error', (err) => console.error('connect_error:', err.message));
socket.on('message:new', (msg) => console.log('message:new', msg));
socket.on('typing:start', (d) => console.log('typing:start', d));
socket.on('typing:stop', (d) => console.log('typing:stop', d));
socket.on('presence:update', (d) => console.log('presence:update', d));
socket.on('message:read', (d) => console.log('message:read', d));
