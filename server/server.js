const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3001;
const dbConfig = require("./config/dbConfig");
const { testConnection, initializeDatabase } = require("./config/database");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

// Create HTTP server and Socket.IO instance for real-time communication
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// API route registration
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/daily-buses", require("./routes/dailyBusesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use(
  "/api/international-cities",
  require("./routes/internationalCitiesRoutes")
);

/**
 * Socket.IO Connection Management
 * Handles real-time communication between users and agents
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user to their personal room for direct messaging
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join agent to their personal room for direct messaging
  socket.on("join-agent", (agentId) => {
    socket.join(`agent-${agentId}`);
    console.log(`Agent ${agentId} joined their room`);
  });

  // Join specific chat room for group communication
  socket.on("join-chat", (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
  });

  // Handle new message delivery to recipients
  socket.on("send-message", (data) => {
    const { chatId, message, recipientType, recipientId } = data;

    // Emit message to recipient's personal room for immediate delivery
    if (recipientType === "user") {
      socket.to(`user-${recipientId}`).emit("new-message", { chatId, message });
    } else if (recipientType === "agent") {
      socket
        .to(`agent-${recipientId}`)
        .emit("new-message", { chatId, message });
    }

    // Confirm message sent to sender
    socket.emit("message-sent", { chatId, message });
  });

  // Handle typing indicators for better user experience
  socket.on("typing", (data) => {
    const { chatId, isTyping, recipientType, recipientId } = data;

    // Show typing indicator to recipient
    if (recipientType === "user") {
      socket
        .to(`user-${recipientId}`)
        .emit("user-typing", { chatId, isTyping });
    } else if (recipientType === "agent") {
      socket
        .to(`agent-${recipientId}`)
        .emit("agent-typing", { chatId, isTyping });
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make Socket.IO instance available to routes for emitting messages
app.set("io", io);

// Start server and listen on specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Initialize PostgreSQL connection and database
const initializeApp = async () => {
  try {
    await testConnection();
    await initializeDatabase();
    console.log("PostgreSQL connection successful");
  } catch (error) {
    console.warn(
      "PostgreSQL connection failed - continuing without PostgreSQL:",
      error.message
    );
    console.log(
      "Note: Install and start PostgreSQL to use daily buses feature"
    );
  }
  // Note: Server is already listening on line 108 with Socket.IO support
  console.log("MongoDB connection active");
};

// Start the application
initializeApp();
