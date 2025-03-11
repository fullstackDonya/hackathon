import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';
import './Notifications.css';

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications.list);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    return (
        <div className="notifications-container">
            <h3>Notifications</h3>
            <button onClick={handleMarkAllAsRead}>Marquer tout comme lu</button>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification._id} className={notification.read ? 'read' : 'unread'}>
                        <p>{notification.message}</p>
                        <button onClick={() => handleMarkAsRead(notification._id)}>Marquer comme lu</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;