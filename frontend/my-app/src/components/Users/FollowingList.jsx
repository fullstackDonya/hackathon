import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowing } from '../../redux/slices/SubscribeSlice';

const FollowingList = () => {
  const dispatch = useDispatch();
  const following = useSelector((state) => state.subscription.following);
  const users = useSelector((state) => state.users.list);

  useEffect(() => {
    dispatch(fetchFollowing());
  }, [dispatch]);

  const followedUsers = users.filter((user) => following.includes(user.id));

  return (
    <div className="following-list">
      <h3>Utilisateurs suivis</h3>
      {followedUsers.length === 0 ? (
        <p>Vous ne suivez encore personne.</p>
      ) : (
        <ul>
          {followedUsers.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingList;