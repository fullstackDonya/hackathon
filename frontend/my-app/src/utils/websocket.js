import { addNotification } from "../redux/slices/notificationSlice";
import store from '../redux/store';

let socket = null;

export const connectWebSocket = (userId) => {
    if (socket) {
        socket.close();
        console.log("🔌 Fermeture de l'ancienne connexion WebSocket...");
    }

    socket = new WebSocket(`ws://localhost:8082/ws/${userId}`);

    socket.onopen = () => {
        console.log('WebSocket connecté');
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Message reçu via WebSocket:", message);

        if (message.type === 'notification') {
            store.dispatch(addNotification(message));
        }
    };

    socket.onclose = () => {
        console.log('WebSocket déconnecté.');
    };

    socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
    };
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        console.log("Message envoyé via WebSocket :", message);
    } else {
        console.warn("⚠️ WebSocket non connecté, impossible d'envoyer le message.");
    }
};

// Fonction pour récupérer l'instance WebSocket actuelle
export const getSocket = () => socket;