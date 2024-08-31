const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server that uses the HTTP server
const wss = new WebSocket.Server({ server });

console.log('Signaling server running on http://localhost:8080');

// Broadcast message to all clients except the sender
function broadcast(message, sender) {
    wss.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received message:', message);
        broadcast(message, ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Start the HTTP server
server.listen(8080, () => {
    console.log('HTTP server listening on port 8080');
});
