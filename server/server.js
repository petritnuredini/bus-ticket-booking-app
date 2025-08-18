const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3001;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join agent to their personal room
  socket.on('join-agent', (agentId) => {
    socket.join(`agent-${agentId}`);
    console.log(`Agent ${agentId} joined their room`);
  });

  // Join specific chat room
  socket.on('join-chat', (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
  });

  // Handle new message
  socket.on('send-message', (data) => {
    const { chatId, message, recipientType, recipientId } = data;
    
    // Emit to recipient's room
    if (recipientType === 'user') {
      socket.to(`user-${recipientId}`).emit('new-message', { chatId, message });
    } else if (recipientType === 'agent') {
      socket.to(`agent-${recipientId}`).emit('new-message', { chatId, message });
    }
    
    // Emit to sender's room for confirmation
    socket.emit('message-sent', { chatId, message });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { chatId, isTyping, recipientType, recipientId } = data;
    
    if (recipientType === 'user') {
      socket.to(`user-${recipientId}`).emit('user-typing', { chatId, isTyping });
    } else if (recipientType === 'agent') {
      socket.to(`agent-${recipientId}`).emit('agent-typing', { chatId, isTyping });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes for emitting messages
app.set('io', io);

// listen to port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
