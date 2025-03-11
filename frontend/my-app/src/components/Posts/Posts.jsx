import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts, deletePost, createPost } from "../../redux/slices/postsSlice";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faRetweet, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./css/Posts.css";

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.posts.list);
  const users = useSelector((state) => state.users.list);
  const authUserId = useSelector((state) => state.auth.userId); // Utilisateur connecté
  const authToken = useSelector((state) => state.auth.token); // Token d'authentification
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers()); // Récupérer les utilisateurs
  }, [dispatch]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!authUserId) {
      console.error("Utilisateur non authentifié");
      return;
    }
    const formData = new FormData();
    formData.append("title", newPost);
    formData.append("author", authUserId);
    if (image) {
      formData.append("image", image);
    }
    dispatch(createPost({ formData, authToken }));
    setNewPost("");
    setImage(null);
  };

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleGet = (id) => {
    navigate(`/post/${id}`);
  };
  const handleLike = (postId) => {
    console.log("Like post: ", postId);
  };

  const handleRetweet = (postId) => {
    console.log("Retweet post: ", postId);
  };

  return (
    <div className="container-posts">
      <div className="main-content">
        <div className="posts-section">
          <form onSubmit={handlePostSubmit}>
            <input
              type="text"
              placeholder="Quoi de neuf ?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="new-post-input"
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="new-post-input"
            />
            <button type="submit" className="post-button">
              Poster
            </button>
          </form>

          <ul>
            {posts.map((post) => (
              <li key={post._id} className="post-item">
           <  a href="#" onClick={() => handleGet(post._id)} className="post-link">
                  <p><strong>{post.title}</strong></p>
                  <p>{post.createdAt}</p>
                </a>
                {/* Boutons Modifier/Supprimer si c'est l'auteur */}
                {authUserId && authUserId === post.userId ? (
                  <div className="post-actions">
                    <button onClick={() => navigate(`/post/edit/${post._id}`)}>
                      <FontAwesomeIcon icon={faEdit} /> Modifier
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} /> Supprimer
                    </button>
                  </div>
                ) : (
                  // Sinon, afficher Like et Retweet
                  <div className="post-actions">
                    <button onClick={() => handleLike(post._id)} className={post.isLiked ? "active" : ""}>
                      <FontAwesomeIcon icon={faThumbsUp} /> {post.likes > 0 && <span>{post.likes}</span>}
                    </button>
                    <button onClick={() => handleRetweet(post._id)} className={post.isRetweeted ? "active" : ""}>
                      <FontAwesomeIcon icon={faRetweet} /> {post.retweets > 0 && <span>{post.retweets}</span>}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Liste des utilisateurs */}
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
      </div>
    </div>
  );
};

export default Posts;