import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSignets, addSignet, removeSignet } from "../../redux/slices/signetSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./css/favorites.css";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signets = useSelector((state) => state.signets.signets) || [];
  const loading = useSelector((state) => state.signets.loading);
  const error = useSelector((state) => state.signets.error);
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(getUserSignets());
  }, [dispatch]);

  useEffect(() => {
    console.log("Signets reçus:", signets);
  }, [signets]);

  const handleToggleFavorite = (postId) => {
    const isFavorite = signets.some((signet) => signet.post?._id === postId);
    if (isFavorite) {
      dispatch(removeSignet({ postId, authToken }));
    } else {
      dispatch(addSignet({ postId, authToken }));
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error.message || error}</div>;
  }

  return (
    <div className="favorites-page">
     
      <div className="favorites-container">
        <h2>Mes Favoris</h2>
        <div className="favorites-grid">
          {signets.map((signet) => (
            <div key={signet._id} className="favorite-post">
              <h4>{signet.post?.title}</h4>
              <p>{signet.post?.content}</p>
              <p className="post-date">
                {signet.post?.createdAt ? new Date(signet.post.createdAt).toLocaleDateString() : "Date inconnue"}
              </p>
              <div className="post-actions">
                <button onClick={() => navigate(`/post/${signet.post?._id}`)}>
                  Voir le post
                </button>
                <button
                  onClick={() => handleToggleFavorite(signet.post?._id)}
                  className={`favorite-button ${signets.some((s) => s.post?._id === signet.post?._id) ? "added" : ""}`}
                >
                  <FontAwesomeIcon icon={faBookmark} /> {signets.some((s) => s.post?._id === signet.post?._id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;