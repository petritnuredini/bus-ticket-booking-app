const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/authMiddleware');

// Get all agents
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find({}, '-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available agents
router.get('/available', async (req, res) => {
  try {
    const agents = await Agent.find({
      isAvailable: true,
      status: 'online'
    }, 'name avatar status specialization');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get agent by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id, '-password');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new agent
router.post('/', async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    
    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const agent = new Agent({
      name,
      email,
      password: hashedPassword,
      specialization: specialization || ['general']
    });
    
    const savedAgent = await agent.save();
    const { password: _, ...agentWithoutPassword } = savedAgent.toObject();
    
    res.status(201).json(agentWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update agent status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, isAvailable } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
    
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, select: '-password' }
    );
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update agent profile
router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, avatar, specialization } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (specialization) updateData.specialization = specialization;
    
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, select: '-password' }
    );
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agent login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update status to online
    agent.status = 'online';
    await agent.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { agentId: agent._id, email: agent.email },
      process.env.jwt_secret || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    const { password: _, ...agentWithoutPassword } = agent.toObject();
    res.json({ ...agentWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agent logout
router.post('/:id/logout', auth, async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { status: 'offline' },
      { new: true, select: '-password' }
    );
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
