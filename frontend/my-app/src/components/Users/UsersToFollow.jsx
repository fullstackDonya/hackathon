import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser, fetchFollowing } from "../../redux/slices/SubscribeSlice";
import "./css/UsersToFollow.css";

const UsersToFollow = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const followingList = useSelector((state) => state.subscription?.following || []);

  useEffect(() => {
    dispatch(fetchFollowing());
  }, [dispatch]);
  
  const handleFollow = (userId) => {
    dispatch(followUser(userId));
  };

  const handleUnfollow = (userId) => {
    dispatch(unfollowUser(userId));
  };

  const isFollowing = (userId) => {
    return followingList.includes(userId);
  };

  return (
    <div className="users-section">
      <h1><i className="fa-solid fa-users"></i></h1>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="user-item">
            <img src="/img/profile.png" alt="profile" className="profile-image" />
            <p>{user.username}</p>
            {isFollowing(user._id) ? (
              <button 
                className="unfollow-button"
                onClick={() => handleUnfollow(user._id)}
              >
                Unfollow
              </button>
            ) : (
              <button 
                className="follow-button"
                onClick={() => handleFollow(user._id)}
              >
                Follow
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersToFollow;