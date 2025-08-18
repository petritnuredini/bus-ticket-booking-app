const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'busy'],
    default: 'offline'
  },
  specialization: [{
    type: String,
    enum: ['schedule', 'booking', 'location', 'general']
  }],
  activeChats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  maxActiveChats: {
    type: Number,
    default: 5
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalChats: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
agentSchema.index({ status: 1, isAvailable: 1 });
agentSchema.index({ specialization: 1 });

module.exports = mongoose.model('Agent', agentSchema);
