const http = require('http');

console.log('🧪 Testing Authenticated Endpoints...\n');

async function testWithToken() {
  // First, get a token by logging in
  const loginData = JSON.stringify({
    email: 'agent@busticket.com',
    password: 'agent123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/agents/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(loginOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.token) {
            console.log('✅ Login successful, got token');
            resolve(response.token);
          } else {
            reject(new Error('No token received'));
          }
        } catch (e) {
          reject(new Error('Failed to parse login response'));
        }
      });
    });

    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

async function testAgentDetails(token) {
  console.log('\n2. Testing agent details with token...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/agents/68a1dfa5ef32ded9355e3595',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log('   ✅ Success! Agent details:');
            console.log('   - Name:', response.name);
            console.log('   - Status:', response.status);
            console.log('   - Specialization:', response.specialization.join(', '));
            resolve(true);
          } else {
            console.log('   ❌ Failed:', data);
            resolve(false);
          }
        } catch (e) {
          console.log('   ❌ Parse error:', data);
          resolve(false);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  try {
    console.log('1. Getting authentication token...');
    const token = await testWithToken();
    
    const success = await testAgentDetails(token);
    
    if (success) {
      console.log('\n🎉 All tests passed! Authentication is working properly.');
      console.log('\n📋 Next steps:');
      console.log('1. Open http://localhost:3000 in your browser');
      console.log('2. Navigate to /agent/login');
      console.log('3. Use credentials: agent@busticket.com / agent123');
      console.log('4. You should now be able to access the agent dashboard!');
    } else {
      console.log('\n❌ Authentication test failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
