import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUserId, deletePost } from "../../redux/slices/postsSlice";
import { fetchUserById, fetchUsers } from "../../redux/slices/usersSlice";
import { getUserSignets } from '../../redux/slices/signetSlice';
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faPencilAlt, faCalendarAlt, faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./css/account.css";
import profileImage from "./img/profile.webp"; 
import { followUser, unfollowUser, fetchFollowing, fetchFollowers } from "../../redux/slices/SubscribeSlice";

const Account = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const users = useSelector((state) => state.users.list); 
  const posts = useSelector((state) => state.posts.list);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const following = useSelector((state) => state.subscription.following);
  const followers = useSelector((state) => state.subscription.followers);
  const [profileImageSrc, setProfileImageSrc] = useState(localStorage.getItem('profileImage') || profileImage);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchPostsByUserId(userId));
      dispatch(fetchUsers());
      dispatch(getUserSignets());
      dispatch(fetchFollowing());
      dispatch(fetchFollowers());
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

  const followedUsers = user.following ? user.following.map((followedUserId) => {
    const followedUser = users.find((u) => u._id === followedUserId);
    return followedUser ? (
      <li key={followedUser._id}>
        {followedUser.username}
        <button onClick={() => handleUnfollow(followedUser._id)}>Ne plus suivre</button>
      </li>
    ) : null;
  }) : [];

  return (
    <div className="account-container">
      <div className="account-header">
        <Link to="/add-post" className="add-post-button">
          <FontAwesomeIcon icon={faPlus} />
        </Link>
        <Link to="/favorites" className="favorites-button">
          <FontAwesomeIcon icon={faBookmark} /> 
        </Link>
      </div>

      <div className="account-info">
        <div style={{ position: "relative" }}>
          <img src={profileImageSrc} alt="Profil" className="profile-img" />
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
          <p>{user.firstname} {user.lastname}</p>
          <p><FontAwesomeIcon icon={faCalendarAlt} /> Membre depuis le {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <button className="edit-profile-button" onClick={() => navigate(`/edit_user/${userId}`)}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </div>

      <div className="followed-users">
        <Link to="/following">following ({following.length})</Link>
        <ul>
          {followedUsers}
        </ul>
      </div>

      <div className="followers">
        <Link to="/followers">Followers ({followers.length})</Link>
        <ul>
          {followers.map((follower) => (
            <li key={follower._id}>
              {follower.username}
            </li>
          ))}
        </ul>
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