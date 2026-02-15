const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketAuth = require('../middlewares/socketAuth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
});

// Apply Authentication middleware to all socket connections
io.use(socketAuth)

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
