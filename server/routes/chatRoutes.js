const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Agent = require('../models/Agent');
const auth = require('../middlewares/authMiddleware');

/**
 * GET /api/chat/user/:userId - Get all chats for a specific user
 * Returns chat history with agent details for the authenticated user
 */
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

/**
 * GET /api/chat/agent/:agentId - Get all chats assigned to a specific agent
 * Returns active and closed chats for the authenticated agent
 */
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

/**
 * GET /api/chat/:chatId - Get details of a specific chat session
 * Returns complete chat information including messages and participant details
 */
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

/**
 * POST /api/chat - Create a new chat session
 * Automatically assigns an available agent based on topic and availability
 * Creates the initial chat structure for user-agent communication
 */
router.post('/', async (req, res) => {
  try {
    const { userId, topic } = req.body;
    
    if (!userId || !topic) {
      return res.status(400).json({ message: 'userId and topic are required' });
    }
    
    // Find available agent based on topic specialization and current workload
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
    
    // Add this chat to agent's active chats list
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

/**
 * POST /api/chat/:chatId/messages - Send a new message in an existing chat
 * Adds message to chat history and emits real-time updates via Socket.IO
 * Supports both user and agent messages
 */
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
      // Emit to the specific chat room for all participants
      io.to(`chat-${chat._id}`).emit('new-message', {
        chatId: chat._id,
        message: message
      });
      
      // Also emit to the recipient's personal room for immediate delivery
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

/**
 * PATCH /api/chat/:chatId/close - Close an active chat session
 * Marks chat as closed and removes it from agent's active chats list
 * Prevents new messages from being sent to closed chats
 */
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
    
    // Remove chat from agent's active chats list
    await Agent.findByIdAndUpdate(chat.agentId, {
      $pull: { activeChats: chat._id }
    });
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/chat/:chatId/read - Mark messages as read by recipient
 * Updates message read status to track user engagement and agent response times
 */
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
