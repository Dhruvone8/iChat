const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketAuth = require('../middlewares/socketAuth');
const dotenv = require("dotenv")
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
});

// Apply Authentication middleware to all socket connections
io.use(socketAuth);

// Store Online Users
const userSocketMap = {}

io.on('connection', (socket) => {
    console.log('User connected:', socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit('onlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user.fullName);
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    })
});

module.exports = { io, app, server };
