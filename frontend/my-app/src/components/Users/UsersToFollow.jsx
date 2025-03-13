import React from "react";
import { useSelector } from "react-redux";
import "./css/UsersToFollow.css";

const UsersToFollow = () => {
  const users = useSelector((state) => state.users.list);

  return (
    <div className="users-section">
      <h3>Utilisateurs à suivre</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <p>{user.username}</p>
            <button className="follow-button" onClick={() => console.log("Suivre", user.id)}>Suivre</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersToFollow;