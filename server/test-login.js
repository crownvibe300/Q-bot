const http = require('http');

// First, let's register a test user
const registerData = JSON.stringify({
  email: 'testuser@example.com',
  password: 'TestPass123',
  firstName: 'Test',
  lastName: 'User'
});

const registerOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

console.log('Testing registration...');
const registerReq = http.request(registerOptions, (res) => {
  console.log(`Registration Status: ${res.statusCode}`);
  
  res.setEncoding('utf8');
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Registration Response:', responseData);
    
    // Now test login
    setTimeout(() => {
      testLogin();
    }, 1000);
  });
});

registerReq.on('error', (e) => {
  console.error(`Registration error: ${e.message}`);
});

registerReq.write(registerData);
registerReq.end();

function testLogin() {
  console.log('\nTesting login...');
  
  const loginData = JSON.stringify({
    email: 'testuser@example.com',
    password: 'TestPass123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    console.log(`Login Status: ${res.statusCode}`);
    
    res.setEncoding('utf8');
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Login Response:');
      try {
        const parsed = JSON.parse(responseData);
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.success && parsed.token) {
          console.log('\n✅ Login API is working correctly!');
          console.log('Token received:', parsed.token.substring(0, 20) + '...');
        }
      } catch (e) {
        console.log(responseData);
      }
    });
  });

  loginReq.on('error', (e) => {
    console.error(`Login error: ${e.message}`);
  });

  loginReq.write(loginData);
  loginReq.end();
}
