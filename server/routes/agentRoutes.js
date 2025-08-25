const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/authMiddleware');

/**
 * GET /api/agents - Retrieve all agents (admin only)
 * Returns list of all agents without sensitive information like passwords
 */
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find({}, '-password'); // Exclude password field
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/agents/available - Get list of available agents
 * Returns agents who are online and available for new chat requests
 * Used by chat system to assign users to available agents
 */
router.get('/available', async (req, res) => {
  try {
    const agents = await Agent.find({
      isAvailable: true,
      status: 'online'
    }, 'name avatar status specialization'); // Only return necessary fields
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/agents/:id - Get specific agent details
 * Returns agent information by ID (requires authentication)
 */
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

/**
 * POST /api/agents - Create a new agent account
 * Allows administrators to add new customer service agents
 * Automatically hashes passwords for security
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    
    // Prevent duplicate agent accounts
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }
    
    // Hash password with bcrypt for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const agent = new Agent({
      name,
      email,
      password: hashedPassword,
      specialization: specialization || ['general'] // Default to general support
    });
    
    const savedAgent = await agent.save();
    const { password: _, ...agentWithoutPassword } = savedAgent.toObject(); // Remove password from response
    
    res.status(201).json(agentWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/agents/:id/status - Update agent availability status
 * Allows agents to set themselves as online/offline/busy
 * Also controls whether they accept new chat requests
 */
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

/**
 * PATCH /api/agents/:id - Update agent profile information
 * Allows agents to modify their name, avatar, and specializations
 */
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

/**
 * POST /api/agents/login - Agent authentication
 * Verifies agent credentials and returns JWT token for session management
 * Automatically sets agent status to 'online' upon successful login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password against stored hash
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update agent status to online for chat availability
    agent.status = 'online';
    await agent.save();
    
    // Generate JWT token for authenticated session
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

/**
 * POST /api/agents/:id/logout - Agent logout
 * Sets agent status to 'offline' and removes them from available agents list
 * Requires valid authentication token
 */
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
