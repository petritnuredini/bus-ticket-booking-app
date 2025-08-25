const mongoose = require('mongoose');

/**
 * Message Schema - Represents individual messages within a chat
 * Each message has a sender, content, timestamp, and read status
 */
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'agent'] // Only users and agents can send messages
  },
  senderId: {
    type: String,
    required: true // ID of the sender (user or agent)
  },
  content: {
    type: String,
    required: true // The actual message text
  },
  timestamp: {
    type: Date,
    default: Date.now // When the message was sent
  },
  isRead: {
    type: Boolean,
    default: false // Track if recipient has read the message
  }
});

/**
 * Chat Schema - Represents a conversation session between a user and an agent
 * Contains all messages, metadata, and status information
 */
const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true // ID of the user starting the chat
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true // ID of the agent handling the chat
  },
  messages: [messageSchema], // Array of all messages in this chat
  status: {
    type: String,
    enum: ['active', 'closed'], // Chat can be active or closed
    default: 'active'
  },
  lastMessage: {
    type: Date,
    default: Date.now // Timestamp of the most recent message
  },
  topic: {
    type: String,
    enum: ['schedule', 'booking', 'location', 'general'], // Chat topic for routing
    default: 'general'
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Database indexes for better query performance
chatSchema.index({ userId: 1, agentId: 1 }); // Fast lookups by user and agent
chatSchema.index({ status: 1, lastMessage: -1 }); // Efficient sorting of active chats

module.exports = mongoose.model('Chat', chatSchema);
