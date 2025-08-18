const http = require('http');

console.log('🧪 Testing basic server response...\n');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/agents/available',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('✅ Server is responding!');
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.end();
