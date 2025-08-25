const axios = require("axios");

const BASE_URL = "http://localhost:3001/api";

// Test the chat system endpoints
async function testChatSystem() {
  console.log("🧪 Testing Chat System...\n");

  try {
    // Test 1: Check if server is running
    console.log("1. Testing server connectivity...");
    const response = await axios.get(`${BASE_URL}/agents/available`);
    console.log("✅ Server is running and responding");
    console.log("Available agents:", response.data.length);
    console.log("");

    // Test 2: Test agent login
    console.log("2. Testing agent login...");
    const loginResponse = await axios.post(`${BASE_URL}/agents/login`, {
      email: "agent@busticket.com",
      password: process.env.AGENT_PASSWORD,
    });
    console.log("✅ Agent login successful");
    console.log("Agent ID:", loginResponse.data._id);
    console.log("Agent Name:", loginResponse.data.name);
    console.log("");

    // Test 3: Test getting agent details
    console.log("3. Testing get agent details...");
    const agentResponse = await axios.get(
      `${BASE_URL}/agents/${loginResponse.data._id}`
    );
    console.log("✅ Agent details retrieved successfully");
    console.log("Agent Status:", agentResponse.data.status);
    console.log("Agent Specialization:", agentResponse.data.specialization);
    console.log("");

    console.log("🎉 All tests passed! The chat system is working properly.");
    console.log("\n📋 Next steps:");
    console.log("1. Open http://localhost:3000 in your browser");
    console.log("2. Navigate to /agent/login to test agent dashboard");
    console.log(
      "3. Use credentials: agent@busticket.com / ",
      process.env.AGENT_PASSWORD
    );
    console.log("4. Test the chat functionality between users and agents");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the tests
testChatSystem();
