const http = require('http');

console.log('🧪 Testing Chat Creation (Detailed)...\n');

const chatData = JSON.stringify({
  userId: 'test-user-123',
  topic: 'schedule'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(chatData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    console.log(data);
    
    try {
      if (res.statusCode === 201) {
        const response = JSON.parse(data);
        console.log('\n✅ Chat created successfully!');
        console.log('Chat ID:', response._id);
        console.log('User ID:', response.userId);
        console.log('Agent ID:', response.agentId);
        console.log('Topic:', response.topic);
        console.log('Status:', response.status);
      } else {
        console.log('\n❌ Chat creation failed with status:', res.statusCode);
        try {
          const errorResponse = JSON.parse(data);
          console.log('Error message:', errorResponse.message);
        } catch (e) {
          console.log('Raw error response:', data);
        }
      }
    } catch (e) {
      console.log('Failed to parse response:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(chatData);
req.end();
