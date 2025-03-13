const WebSocket = require('ws');

let wss;

function setupWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const userId = req.url.split('/').pop(); // Récupérer l'ID utilisateur depuis l'URL
        ws.userId = userId;
        console.log(`Client connecté au WebSocket: ${userId}`);

        ws.on('message', (message) => {
            console.log('Message reçu:', message);
        });

        ws.on('close', () => console.log(`Client déconnecté: ${userId}`));
    });

    return wss;
}

function sendNotification(userId, notification) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.userId === userId) {
            client.send(JSON.stringify(notification));
        }
    });
}

module.exports = { setupWebSocket, sendNotification };