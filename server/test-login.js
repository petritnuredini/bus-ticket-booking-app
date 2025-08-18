const http = require('http');

console.log('🧪 Testing Agent Login...\n');

const loginData = JSON.stringify({
  email: 'agent@busticket.com',
  password: 'agent123'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/agents/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
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
      const response = JSON.parse(data);
      console.log('Response:');
      console.log('- Agent ID:', response._id);
      console.log('- Agent Name:', response.name);
      console.log('- Agent Email:', response.email);
      console.log('- Token:', response.token ? '✅ Present' : '❌ Missing');
      console.log('- Token Length:', response.token ? response.token.length : 0);
      
      if (response.token) {
        console.log('\n🎉 Login successful with token!');
        console.log('You can now use this token for authenticated requests.');
      } else {
        console.log('\n❌ Login failed - no token returned');
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(loginData);
req.end();
