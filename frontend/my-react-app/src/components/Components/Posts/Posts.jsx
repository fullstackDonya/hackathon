import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts, deletePost } from "../../redux/slices/postsSlice";
import "./css/Posts.css";

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.posts.list);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const [loadingImages, setLoadingImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadingImages((prevState) => ({
      ...prevState,
      [id]: false, // Indique que l'image est chargée
    }));
  };

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/edit_post/${id}`);
  };

  const handleGet = (id) => {
    navigate(`/post/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette recette ?")) {
      dispatch(deletePost(id))
        .then(() => {
          alert("Recette supprimée avec succès !");
          dispatch(fetchPosts()); // Re-fetch posts after deletion
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de la recette", error);
        });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <p><strong>{post.title}</strong> </p>
            <p>{post.createdAt}</p>
            
            {post.images && post.images.length > 0 && (
              <div className="post-images">
                {post.images.map((image, index) => (
                  <div key={index}>
                    {loadingImages[post._id] ? (
                      <div>Chargement de l'image...</div> // Indicateur de chargement
                    ) : (
                      <img
                        src={`/uploads/${image}`}
                        alt={`Image ${index + 1}`}
                        className="post-image"
                        onLoad={() => handleImageLoad(post._id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <button className="get" onClick={() => handleGet(post._id)}>Voir plus</button>
            {/* Les boutons Modifier et Supprimer */}
            {/* <button className="update" onClick={() => handleEdit(post._id)}>Modifier</button>
            <button className="delete" onClick={() => handleDelete(post._id)}>Effacer</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
