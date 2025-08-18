const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Agent = require('../models/Agent');
const auth = require('../middlewares/authMiddleware');

// Get all chats for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId })
      .populate('agentId', 'name avatar status')
      .sort({ lastMessage: -1 });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all chats for an agent
router.get('/agent/:agentId', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ agentId: req.params.agentId })
      .populate('userId', 'name email')
      .sort({ lastMessage: -1 });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific chat
router.get('/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('userId', 'name email')
      .populate('agentId', 'name avatar status');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new chat
router.post('/', async (req, res) => {
  try {
    const { userId, topic } = req.body;
    
    if (!userId || !topic) {
      return res.status(400).json({ message: 'userId and topic are required' });
    }
    
    // Find available agent based on topic
    const agent = await Agent.findOne({
      isAvailable: true,
      status: 'online',
      specialization: { $in: [topic, 'general'] },
      $expr: { $lt: [{ $size: '$activeChats' }, '$maxActiveChats'] }
    });
    
    if (!agent) {
      return res.status(404).json({ message: 'No agents available at the moment' });
    }
    
    const chat = new Chat({
      userId,
      agentId: agent._id,
      topic,
      messages: []
    });
    
    const savedChat = await chat.save();
    
    // Add chat to agent's active chats
    await Agent.findByIdAndUpdate(agent._id, {
      $push: { activeChats: savedChat._id }
    });
    
    // Populate agent details for the response
    const populatedChat = await Chat.findById(savedChat._id)
      .populate('agentId', 'name avatar status');
    
    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { content, sender, senderId } = req.body;
    
    const message = {
      content,
      sender,
      senderId,
      timestamp: new Date()
    };
    
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        $push: { messages: message },
        lastMessage: new Date()
      },
      { new: true }
    ).populate('agentId', 'name avatar status');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Emit the message via Socket.IO for real-time communication
    const io = req.app.get('io');
    if (io) {
      // Emit to the specific chat room
      io.to(`chat-${chat._id}`).emit('new-message', {
        chatId: chat._id,
        message: message
      });
      
      // Also emit to the recipient's personal room
      if (message.sender === 'user') {
        io.to(`agent-${chat.agentId._id}`).emit('new-message', {
          chatId: chat._id,
          message: message
        });
      } else if (message.sender === 'agent') {
        io.to(`user-${chat.userId}`).emit('new-message', {
          chatId: chat._id,
          message: message
        });
      }
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
});

// Close chat
router.patch('/:chatId/close', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { status: 'closed' },
      { new: true }
    );
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Remove chat from agent's active chats
    await Agent.findByIdAndUpdate(chat.agentId, {
      $pull: { activeChats: chat._id }
    });
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.patch('/:chatId/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        'messages.$[elem].isRead': true
      },
      {
        arrayFilters: [{ 'elem.senderId': { $ne: userId } }],
        new: true
      }
    );
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
