const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'message' || data.type === 'typing') {
            // Broadcast to all clients except the sender
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });

    ws.send(JSON.stringify({ type: 'info', message: 'Connected to WebSocket server' }));
});

console.log('WebSocket server is listening on ws://localhost:8080');
