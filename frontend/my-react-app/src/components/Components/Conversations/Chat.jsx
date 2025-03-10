import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, addMessageToConversation  } from '../../redux/slices/messageSlice';
import { connectWebSocket, sendMessage as sendWebSocketMessage, getSocket } from '../../utils/websocket';
import { selectMessagesByConversationId, selectUserId, selectSelectedConversationId } from '../../redux/selectors';
import './css/Chat.css';

const Chat = () => {
    const dispatch = useDispatch();
    const conversationId = useSelector(selectSelectedConversationId); // Récupérer l'ID de la conversation depuis le store Redux
    const messages = useSelector(selectMessagesByConversationId);
    const userId = useSelector(selectUserId); 
    const [message, setMessage] = useState('');
    console.log("User ID:", userId); 

  
    useEffect(() => {x
        if (!conversationId) return;
    
        console.log("Changement de conversationId:", conversationId);
        dispatch(fetchMessages(conversationId));
        connectWebSocket(conversationId); // Reconnecte WebSocket à chaque changement de conversation
        
        return () => {
            const socket = getSocket();
            if (socket) {
                socket.close();
                console.log("Fermeture WebSocket");
            }
        };
    }, [dispatch, conversationId]);
    
    
    console.log("conversationId:", conversationId);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = { sender: userId, conversationId, content: message };
            console.log("🛠 Envoi du message via WebSocket :", newMessage);
            
            const socket = getSocket();
            if (socket && socket.readyState === WebSocket.OPEN) {
                sendWebSocketMessage(newMessage); // Envoi en WebSocket ✅
            } else {
                console.warn("⚠️ WebSocket non connecté, envoi via API");
                dispatch(sendMessage(newMessage)); 
            }
    
            dispatch(addMessageToConversation({ conversationId, message: newMessage })); 
            setMessage('');
        }
    };
    
    

    return (
        <div className="chat-container">
            <div className="messages">
                {(messages || []).map((msg) => (
                    <div key={msg._id} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
                    <p>{msg.content}</p>
                    </div>
                ))}
            </div>

            <div className="message-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                />
                <button onClick={handleSendMessage}>Envoyer</button>
            </div>
        </div>
    );
};

export default Chat;