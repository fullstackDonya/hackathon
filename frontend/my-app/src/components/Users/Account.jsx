import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUserId, deletePost } from "../../redux/slices/postsSlice";
import { fetchUserById, fetchUsers } from "../../redux/slices/usersSlice";
import { fetchSignets } from "../../redux/slices/signetSlice";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faPencilAlt, faCalendarAlt, faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./css/account.css";
import profileImage from "./img/profile.webp"; 
import { followUser, unfollowUser } from "../../redux/slices/SubscribeSlice";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const user = useSelector((state) => state.users.user);
  const posts = useSelector((state) => state.posts.list);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const users = useSelector((state) => state.users.list);
  const [profileImageSrc, setProfileImageSrc] = useState(localStorage.getItem('profileImage') || profileImage);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchPostsByUserId(userId));
      dispatch(fetchUsers());
      dispatch(fetchSignets());
    }
  }, [dispatch, userId]);

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageSrc = reader.result;
        setProfileImageSrc(imageSrc);
        localStorage.setItem('profileImage', imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFollow = (userId) => {
    dispatch(followUser(userId)).then(() => {
      dispatch(fetchUserById(userId));
    });
  };

  const handleUnfollow = (userId) => {
    dispatch(unfollowUser(userId)).then(() => {
      dispatch(fetchUserById(userId));
    });
  };

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  const followedUsers = user.following ? users.filter((u) => user.following.includes(u.id)) : [];

  return (
    <div className="account-container">
      <div className="account-header">
        {/* <h2>Mon Compte</h2> */}
        <Link to="/add-post" className="add-post-button">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
        <Link to="/favorites" className="favorites-button">
          <FontAwesomeIcon icon={faBookmark} /> 
        </Link>
      
      </div>

      <div className="account-info">
        <div style={{ position: "relative" }}>
          <img src={profileImageSrc} alt="Profil" className="profile-image" />
          <input
            type="file"
            id="profileImageUpload"
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
          <label
            htmlFor="profileImageUpload"
            className="upload-profile-image-button"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </label>
        </div>
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
              <li key={followedUser.id}>
                {followedUser.username}
                <button onClick={() => handleUnfollow(followedUser.id)}>Ne plus suivre</button>
              </li>
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