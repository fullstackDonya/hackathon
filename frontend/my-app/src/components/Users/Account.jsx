import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUserId, deletePost } from "../../redux/slices/postsSlice";
import { fetchUserById, fetchUsers } from "../../redux/slices/usersSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faPencilAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "./css/account.css";
import profileImage from "./img/profile.webp"; 

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const user = useSelector((state) => state.users.user);
  const posts = useSelector((state) => state.posts.list);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const users = useSelector((state) => state.users.list);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchPostsByUserId(userId));
      dispatch(fetchUsers());
    }
  }, [dispatch, userId]);

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  const followedUsers = user.following ? users.filter((u) => user.following.includes(u.id)) : [];

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Mon Compte</h2>
        <Link to="/add-post" className="add-post-button">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>

      <div className="account-info">
        <img src={profileImage} alt="Profil" className="profile-image" />
        <div className="account-details">
          <p><strong>{user.username}</strong></p>
          <p>{user.email}</p>
          <p>{user.firstname} {user.lastname}</p>
          <p><FontAwesomeIcon icon={faCalendarAlt} /> Membre depuis le {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <button className="edit-profile-button" onClick={() => navigate(`/edit_user/${userId}`)}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </div>

      <div className="followed-users">
        <h3>Utilisateurs suivis</h3>
        {followedUsers.length === 0 ? (
          <p>Vous ne suivez encore personne.</p>
        ) : (
          <ul>
            {followedUsers.map((followedUser) => (
              <li key={followedUser.id}>{followedUser.username}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="account-posts">
        <h3>Mes Posts</h3>
        {loading && <div className="loading">Chargement des posts...</div>}
        {error && <div className="error">Erreur lors du chargement des posts</div>}

        {posts.length === 0 && !loading && !error && (
          <p className="no-posts">Vous n'avez pas encore publié de posts.</p>
        )}

        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
              <div className="post-actions">
                <button onClick={() => navigate(`/post/edit/${post._id}`)}>
                  <FontAwesomeIcon icon={faEdit} /> Modifier
                </button>
                <button onClick={() => handleDelete(post._id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
