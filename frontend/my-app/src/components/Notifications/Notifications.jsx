import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllNotificationsAsRead } from '../../redux/slices/notificationSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  return (
    <div className="notifications-container">
      <div className="notifications-icon" onClick={handleMarkAllAsRead}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span className="notifications-count">{unreadCount}</span>}
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification._id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <p>{notification.type} sur le post {notification.post}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;