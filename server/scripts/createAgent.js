const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Agent = require("../models/Agent");
require("dotenv").config();

/**
 * Create Sample Agent Script
 * This script creates a default customer service agent for testing the chat system
 * Run this script once to set up the initial agent account
 */
const createSampleAgent = async () => {
  try {
    // Connect to MongoDB database
    await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/bus-booking"
    );
    console.log("Connected to MongoDB");

    // Check if agent already exists to prevent duplicates
    const existingAgent = await Agent.findOne({ email: "agent@busticket.com" });
    if (existingAgent) {
      console.log("Agent already exists");
      return;
    }

    // Hash password with bcrypt for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("agent123", salt);

    // Create sample agent with full support capabilities
    const agent = new Agent({
      name: "John Support",
      email: "agent@busticket.com",
      password: hashedPassword,
      specialization: ["schedule", "location", "booking", "general"], // Can handle all topics
      status: "online", // Start as online and available
      isAvailable: true,
      maxActiveChats: 5, // Can handle up to 5 simultaneous chats
    });

    await agent.save();
    console.log("Sample agent created successfully:", agent.email);
    console.log("Login credentials:");
    console.log("Email: agent@busticket.com");
    console.log("Password: your password");
  } catch (error) {
    console.error("Error creating agent:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Execute the agent creation function
createSampleAgent();
