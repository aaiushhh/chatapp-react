const express = require('express');
const app = express();
const MessageRouter = require('./Routes/MessageRouter');
require('dotenv').config();
require('./Models/db'); // Connect to your database

const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ChatRouter = require('./Routes/ChatRouter');

// Serve static files from the Uploads directory
app.use('/Uploads', express.static('C:/path_to_your_uploads_folder/Uploads'));

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ message: "Internal server error" });
});

const server = app.listen(port, (err) => {
    if (err) {
        console.error('Server Error:', err);
        return;
    }
    console.log(`Server listening on port ${port}!`);
});

// Socket.IO connection
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",  // React app URL
    },
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.IO");

    socket.on("setup", (userData) => {
        if (!userData || !userData.username) {
            console.error("Invalid user data provided for setup.");
            return;
        }
        socket.join(userData.username);
        console.log(`User ${userData.username} connected to their personal room.`);
        socket.emit("connected");
    });

    socket.on("join-chat", (room) => {
        if (!room) {
            console.error("Invalid room ID provided for join-chat.");
            return;
        }
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("new-message", (newMessage) => {
        if (!newMessage  || !newMessage.chat.users) {
            console.log("Invalid message or chat data received.");
            return;
        }

        const { chat, sender } = newMessage;

        chat.users.forEach((user) => {
            if (user.username === sender.username) return; // Skip the sender
            console.log(`Sending message to user ${user.username} in chat room.`);
            socket.to(user.username).emit("message-received", newMessage);
        });
    });

    
    socket.on("disconnect", () => {
        console.log("User disconnected from Socket.IO");
    });
});

