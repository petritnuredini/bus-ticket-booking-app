const mongoose = require('mongoose');

/**
 * Agent Schema - Represents customer service agents who handle user chats
 * Agents can be online/offline, have specializations, and manage multiple chats
 */
const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Agent's display name
  },
  email: {
    type: String,
    required: true,
    unique: true // Each agent must have a unique email for login
  },
  password: {
    type: String,
    required: true // Hashed password for secure authentication
  },
  avatar: {
    type: String,
    default: '' // Optional profile picture URL
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'busy'], // Current availability status
    default: 'offline'
  },
  specialization: [{
    type: String,
    enum: ['schedule', 'booking', 'location', 'general'] // Topics this agent can handle
  }],
  activeChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat' // Currently active chat sessions
  }],
  maxActiveChats: {
    type: Number,
    default: 5 // Maximum number of chats an agent can handle simultaneously
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5 // Customer satisfaction rating (0-5 stars)
  },
  totalChats: {
    type: Number,
    default: 0 // Total number of chats handled by this agent
  },
  isAvailable: {
    type: Boolean,
    default: true // Whether agent is accepting new chat requests
  }
}, {
  timestamps: true // Automatically track creation and update times
});

// Database indexes for better query performance
agentSchema.index({ status: 1, isAvailable: 1 }); // Fast lookups for available agents
agentSchema.index({ specialization: 1 }); // Efficient topic-based agent search

module.exports = mongoose.model('Agent', agentSchema);
