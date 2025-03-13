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
      <h3>Utilisateurs à suivre</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="user-item">
            <p>{user.username}</p>
            {isFollowing(user._id) ? (
              <button 
                className="unfollow-button"
                onClick={() => handleUnfollow(user._id)}
              >
                Ne plus suivre
              </button>
            ) : (
              <button 
                className="follow-button"
                onClick={() => handleFollow(user._id)}
              >
                Suivre
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersToFollow;