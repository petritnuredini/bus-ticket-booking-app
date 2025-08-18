const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'agent']
  },
  senderId: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  lastMessage: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: String,
    enum: ['schedule', 'booking', 'location', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatSchema.index({ userId: 1, agentId: 1 });
chatSchema.index({ status: 1, lastMessage: -1 });

module.exports = mongoose.model('Chat', chatSchema);
