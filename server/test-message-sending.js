const http = require('http');

console.log('🧪 Testing Message Sending...\n');

const chatId = '68a241ec53d820ace797f6c4'; // From previous test

// Test sending a message
const testMessageSending = () => {
  return new Promise((resolve, reject) => {
    const messageData = JSON.stringify({
      content: 'Hello! I need help with bus schedules.',
      sender: 'user',
      senderId: 'test-user-123'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: `/api/chat/${chatId}/messages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(messageData)
      }
    }, (res) => {
      console.log(`Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Message sent successfully!');
          try {
            const response = JSON.parse(data);
            console.log(`Chat ID: ${response._id}`);
            console.log(`Messages count: ${response.messages.length}`);
            console.log(`Last message: ${response.messages[response.messages.length - 1]?.content}`);
          } catch (e) {
            console.log('Response data:', data);
          }
        } else {
          console.log('❌ Message sending failed');
          console.log('Response:', data);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.log('❌ Request error:', e.message);
      reject(e);
    });
    
    req.write(messageData);
    req.end();
  });
};

// Test getting chat details
const testGetChat = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: `/api/chat/${chatId}`,
      method: 'GET'
    }, (res) => {
      console.log(`\nGetting chat details - Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Chat details retrieved!');
          try {
            const response = JSON.parse(data);
            console.log(`Chat ID: ${response._id}`);
            console.log(`User ID: ${response.userId}`);
            console.log(`Agent: ${response.agentId?.name || 'Unknown'}`);
            console.log(`Topic: ${response.topic}`);
            console.log(`Status: ${response.status}`);
            console.log(`Messages: ${response.messages.length}`);
          } catch (e) {
            console.log('Response data:', data);
          }
        } else {
          console.log('❌ Failed to get chat details');
          console.log('Response:', data);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.log('❌ Request error:', e.message);
      reject(e);
    });
    
    req.end();
  });
};

// Run tests
async function runTests() {
  try {
    await testMessageSending();
    await testGetChat();
    console.log('\n🎉 All message tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Navigate to /chat to test the chat widget');
    console.log('3. Try starting a new chat with "Schedule & Timing"');
    console.log('4. Send messages and test real-time communication!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
