import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers } from '../../redux/slices/SubscribeSlice';

const FollowersList = () => {
  const dispatch = useDispatch();
  const followers = useSelector((state) => state.subscription.followers);
  const users = useSelector((state) => state.users.list);

  useEffect(() => {
    dispatch(fetchFollowers());
  }, [dispatch]);

  const followerUsers = users.filter((user) => followers.includes(user.id));

  return (
    <div className="followers-list">
      <h3>Followers</h3>
      {followerUsers.length === 0 ? (
        <p>Vous n'avez pas encore de followers.</p>
      ) : (
        <ul>
          {followerUsers.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowersList;