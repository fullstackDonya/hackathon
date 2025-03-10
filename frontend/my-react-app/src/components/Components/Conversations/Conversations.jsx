import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConversations, createConversation, setSelectedConversationId } from "../../redux/slices/conversationSlice";
import { fetchMessages } from "../../redux/slices/messageSlice"; // Importer la fonction pour récupérer les messages
import { selectConversations, selectUserId, selectUsers } from "../../redux/selectors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import './css/Conversations.css';

const Conversations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const conversations = useSelector(selectConversations);
  const users = useSelector(selectUsers);
  const userId = useSelector(selectUserId);
  const [selectedUsers, setSelectedUsers] = useState([userId]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchConversations());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("Conversations:", conversations);
  }, [conversations]);

  const handleUserSelection = (id) => {
    if (id === userId) return;
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleStartConversation = async () => {
    if (selectedUsers.length < 2) {
      alert("Sélectionnez au moins un autre utilisateur !");
      return;
    }

    dispatch(createConversation({ senders: selectedUsers }))
      .then((response) => {
        if (!response.payload || !response.payload._id) {
          console.error("Erreur : ID de la conversation non trouvé");
          return;
        }
        dispatch(setSelectedConversationId(response.payload._id)); // Définir l'ID de la conversation sélectionnée dans le store Redux
        navigate(`/chat`);
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la conversation", error);
      });
  };

  const handleOpenConversation = (conversationId) => {
    console.log("📩 Ouverture de la conversation:", conversationId); // Debug
    dispatch(setSelectedConversationId(conversationId)); 
    dispatch(fetchMessages(conversationId));
    navigate(`/chat`);
  };

  return (
    <div className="conversations-container">
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation._id} onClick={() => handleOpenConversation(conversation._id)}>
            <h3>
              {conversation.senders && Array.isArray(conversation.senders)
                ? conversation.senders
                    .map(sender => sender.username)
                    .join(", ")
                : "Aucun participant"}
            </h3>
          </li>
        ))}
      </ul>
      <div>
        <h3>Groupe <FontAwesomeIcon icon={faPeopleGroup} /> </h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
                disabled={user._id === userId}
              />
              {user.username} {user._id === userId && "(Vous)"}
            </li>
          ))}
        </ul>
        <button onClick={handleStartConversation} disabled={selectedUsers.length < 2}>
          Commencer une nouvelle conversation
        </button>
      </div>
    </div>
  );
};

export default Conversations;