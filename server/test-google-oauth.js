const http = require('http');

// Test Google OAuth endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/google',
  method: 'GET'
};

console.log('Testing Google OAuth endpoint...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.setEncoding('utf8');
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:');
    try {
      const parsed = JSON.parse(responseData);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
