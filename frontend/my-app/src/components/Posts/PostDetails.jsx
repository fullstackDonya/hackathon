import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../redux/slices/postsSlice';
import './css/PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts.currentPost);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const [loadingImage, setLoadingImage] = useState(true);

  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  // Logger l'ID du post
  console.log('====================================');
  console.log('Post ID:', id);
  console.log('====================================');

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  // Vérifiez si le post est défini avant d'accéder à ses propriétés
  if (!post) {
    return <div>Post non trouvé</div>;
  }

  return (
    <div className="post-details">
      
      {post.image && <img src={post.image} alt={post.title} className="post-image" onLoad={handleImageLoad} />}
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetails;