const http = require('http');

console.log('🧪 Testing server connectivity...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/agents/available',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is responding! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('📊 Response data:', response);
      console.log('🎉 Server is working properly!');
    } catch (e) {
      console.log('📄 Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Server connection failed:', e.message);
  console.log('💡 Make sure the server is running on port 3001');
});

req.end();
