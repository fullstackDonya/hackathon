import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUserId } from "../../redux/slices/postsSlice";
import './css/account.css';
import { Link } from 'react-router-dom';

const Account = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.list);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPostsByUserId(userId));
    }
  }, [dispatch, userId]);

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Mon Compte</h2>
        <Link to="/add-post" className="add-post-button">
          <i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <div className="account-info">
        <p>Nom d'utilisateur: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Prénom: {user.firstname}</p>
        <p>Nom: {user.lastname}</p>
      </div>
      <div className="account-posts">
        <h3>Mes Posts</h3>
        {loading && <div className="loading">Chargement des posts...</div>}
        {error && <div className="error">Erreur lors du chargement des posts</div>}
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;