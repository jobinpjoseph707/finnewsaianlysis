// Minimal Node.js HTTP server to test if sockets are allowed
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Socket test: Server is running!\n');
});

const port = 5050;
server.listen(port, '127.0.0.1', () => {
  console.log(`Test server running at http://127.0.0.1:${port}/`);
});

server.on('error', (err) => {
  console.error('Socket test error:', err);
  process.exit(1);
});
