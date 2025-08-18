const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');
require('dotenv').config();

const createSampleAgent = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/bus-booking');
    console.log('Connected to MongoDB');

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email: 'agent@busticket.com' });
    if (existingAgent) {
      console.log('Agent already exists');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('agent123', salt);

    // Create sample agent
    const agent = new Agent({
      name: 'John Support',
      email: 'agent@busticket.com',
      password: hashedPassword,
      specialization: ['schedule', 'location', 'booking', 'general'],
      status: 'online',
      isAvailable: true,
      maxActiveChats: 5
    });

    await agent.save();
    console.log('Sample agent created successfully:', agent.email);
    console.log('Login credentials:');
    console.log('Email: agent@busticket.com');
    console.log('Password: agent123');

  } catch (error) {
    console.error('Error creating agent:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createSampleAgent();
