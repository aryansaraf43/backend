// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For local development; use specific origin in production
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('WhatsApp Clone Server is running');
});

io.on('connection', (socket) => {
    console.log('✅ A user connected:', socket.id);

    // Join a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`🟢 Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', ({ roomId, message }) => {
        console.log(`📤 Message to room ${roomId}:`, message);
        io.to(roomId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
