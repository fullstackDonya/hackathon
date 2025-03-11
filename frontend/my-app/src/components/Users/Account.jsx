import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUserId } from "../../redux/slices/postsSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./css/account.css";

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
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>

      <div className="account-info">
        <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Prénom :</strong> {user.firstname}</p>
        <p><strong>Nom :</strong> {user.lastname}</p>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
