const http = require('http');

// Test health endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Health check completed');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
