// Lightweight Socket.IO server for development
const http = require('http');

const PORT = process.env.SOCKET_PORT || 4030;

// Attempt to require `socket.io` but handle graceful degradation if not installed
let Server;
try {
  Server = require('socket.io').Server;
} catch (err) {
  console.error('\n⚠️  socket.io package is not installed.');
  console.error('Please run: npm install socket.io socket.io-client');
  console.error('Then re-run `npm run socket` to start the dev socket server.\n');
  // Exit with a non-zero code so failing start is obvious
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/emit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { event, data } = payload;
        if (event) {
          io.emit(event, data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'socket-server running' }));
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`\nERROR: Port ${PORT} is already in use.\n`);
    console.error('Try stopping the process using that port or set SOCKET_PORT to a different value.');
    console.error('On Windows (PowerShell) you can run:');
    console.error('  Get-Process -Id (Get-NetTCPConnection -LocalPort 4030).OwningProcess\n');
  } else {
    console.error('Socket server encountered an error:', err);
  }
  process.exit(1);
});
