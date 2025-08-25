const http = require('http');

console.log('🧪 Testing Chat Creation...\n');

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
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      if (res.statusCode === 201) {
        const response = JSON.parse(data);
        console.log('✅ Chat created successfully!');
        console.log('Chat ID:', response._id);
        console.log('User ID:', response.userId);
        console.log('Agent ID:', response.agentId);
        console.log('Topic:', response.topic);
        console.log('Status:', response.status);
        
        if (response.agentId) {
          console.log('Agent Name:', response.agentId.name);
          console.log('Agent Status:', response.agentId.status);
        }
        
        console.log('\n🎉 Chat creation is working! Users can now start conversations.');
      } else {
        console.log('❌ Chat creation failed:', data);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(chatData);
req.end();
