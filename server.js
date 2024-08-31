const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

console.log('Signaling server running on ws://localhost:8080');

// Broadcast message to all clients except the sender
function broadcast(message, sender) {
    server.clients.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

server.on('connection', (ws) => {
    console.log('Client connected');

    // Handle incoming messages from clients
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Broadcast the message to all other clients
        broadcast(message, ws);
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
