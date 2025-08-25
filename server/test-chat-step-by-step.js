const http = require('http');

console.log('🧪 Testing Chat Creation Step by Step...\n');

// Test 1: Check if server responds
console.log('1. Testing server response...');
const test1 = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/agents/available',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('   ✅ Server responds to GET requests');
        resolve();
      });
    });
    req.on('error', reject);
    req.end();
  });
};

// Test 2: Test chat creation
console.log('2. Testing chat creation...');
const test2 = () => {
  return new Promise((resolve, reject) => {
    const chatData = JSON.stringify({
      userId: 'test-user-123',
      topic: 'schedule'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(chatData)
      }
    }, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log('   ✅ Chat created successfully!');
          try {
            const response = JSON.parse(data);
            console.log(`   Chat ID: ${response._id}`);
            console.log(`   Agent: ${response.agentId?.name || 'Unknown'}`);
          } catch (e) {
            console.log('   Response data:', data);
          }
        } else {
          console.log('   ❌ Chat creation failed');
          console.log('   Response:', data);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.log('   ❌ Request error:', e.message);
      reject(e);
    });
    
    req.write(chatData);
    req.end();
  });
};

// Run tests
async function runTests() {
  try {
    await test1();
    console.log('');
    await test2();
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
