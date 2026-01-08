const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mohiteharsh639_db_user:nwToSOqfOOU5dmxb@cluster0.amrqszu.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://rag-with-knowledge-graph.vercel.app", "https://rag-with-knowledge-graph.vercel.app/"], // Frontend URLs
        methods: ["GET", "POST"]
    }
});

// Store io instance to be used in controllers
app.set('socketio', io);

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join user to their own room
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

