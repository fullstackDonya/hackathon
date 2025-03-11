import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConnectedUsers} from '../../redux/slices/usersSlice';
import { createConversation } from '../../redux/slices/conversationSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import "./css/connectedUsers.css";
const ConnectedUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const connectedUsers = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.users.loading);
    const error = useSelector((state) => state.users.error);
    const userId = useSelector((state) => state.auth.userId);

    useEffect(() => {
        dispatch(fetchConnectedUsers());
    }, [dispatch]);

    const handleStartConversation = async (user) => {
        const selectedUsers = [userId, user._id];
        dispatch(createConversation({ senders: selectedUsers }))
            .then((response) => {
                if (!response.payload || !response.payload._id) {
                    console.error("Erreur : ID de la conversation non trouvé");
                    return;
                }
                navigate(`/chat/${response.payload._id}`);
            })
            .catch((error) => {
                console.error("Erreur lors de la création de la conversation", error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <ul className='connected-users-list'>
                {connectedUsers.map((user) => (
                    <li key={user._id}>
                        {user.username} {user._id === userId && "(Vous)"}
                        {user._id !== userId && (
                            <button onClick={() => handleStartConversation(user)}>
                                <FontAwesomeIcon icon={faComments} />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConnectedUsers;