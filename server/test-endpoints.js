const http = require("http");

console.log("🧪 Testing Chat System Endpoints...\n");

function testEndpoint(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  try {
    // Test 1: Check available agents
    console.log("1. Testing /api/agents/available...");
    const agentsResponse = await testEndpoint("/api/agents/available");
    console.log(`   Status: ${agentsResponse.status}`);
    console.log(`   Response: ${JSON.stringify(agentsResponse.data, null, 2)}`);
    console.log("");

    // Test 2: Test agent login
    console.log("2. Testing agent login...");
    const loginData = {
      email: "agent@busticket.com",
      password: process.env.AGENT_PASSWORD,
    };
    const loginResponse = await testEndpoint(
      "/api/agents/login",
      "POST",
      loginData
    );
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Response: ${JSON.stringify(loginResponse.data, null, 2)}`);
    console.log("");

    if (loginResponse.status === 200 && loginResponse.data._id) {
      // Test 3: Get agent details
      console.log("3. Testing get agent details...");
      const agentResponse = await testEndpoint(
        `/api/agents/${loginResponse.data._id}`
      );
      console.log(`   Status: ${agentResponse.status}`);
      console.log(
        `   Response: ${JSON.stringify(agentResponse.data, null, 2)}`
      );
      console.log("");
    }

    console.log("🎉 Endpoint testing completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

runTests();
