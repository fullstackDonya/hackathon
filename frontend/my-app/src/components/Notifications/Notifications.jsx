import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../redux/slices/notificationSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleNotificationClick = (notification) => {
    dispatch(markNotificationAsRead(notification._id));
    if (notification.type === 'like' || notification.type === 'comment' || notification.type === 'retweet' || notification.type === 'signet') {
      navigate(`/post/${notification.post._id}`);
    } else if (notification.type === 'follow' && notification.user) {
      navigate(`/user/${notification.user._id}`);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="notifications-container">
      <div className="notifications-icon" onClick={toggleModal}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && <span className="notifications-count">{unreadCount}</span>}
      </div>
      {isModalOpen && (
        <div className="notifications-modal">
          <div className="notifications-modal-content">
            <span className="close-button" onClick={toggleModal}>&times;</span>
            <h2>Notifications</h2>
            <button onClick={handleMarkAllAsRead}>Marquer tout comme lu</button>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p>{notification.type} sur le post {notification.post?.content || notification.user?.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;