import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../redux/slices/postsSlice';
import { fetchComments, sendComment } from '../../redux/slices/commentSlice';
import { likePost, unlikePost, fetchLikes, likeComment, unlikeComment } from '../../redux/slices/likeSlice';
import { retweetPost, unretweetPost } from '../../redux/slices/retweetSlice';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faRetweet, faComment } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import './css/PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts.currentPost);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const comments = useSelector((state) => state.comments.comments);
  const likes = useSelector((state) => state.likes.likes);
  const commentLikes = useSelector((state) => state.likes.commentLikes);
  const retweets = useSelector((state) => state.retweets.retweets);
  const authUserId = useSelector((state) => state.auth.userId);
  const authToken = useSelector((state) => state.auth.token);
  const [comment, setComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);

  // Références pour la caméra (non affichées)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchComments(id));
    dispatch(fetchLikes(id));
  }, [dispatch, id]);

  // Démarrer la caméra et capturer automatiquement l'émotion dès le montage du composant
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            // Attendre un court délai pour s'assurer que la vidéo est prête
            setTimeout(() => {
              captureEmotion();
              // Arrêter la caméra après capture
              stream.getTracks().forEach(track => track.stop());
            }, 500);
          };
        }
      })
      .catch((err) => console.error("Erreur d'accès à la caméra:", err));
  }, []);

  // Fonction de capture et d'envoi de l'image au backend
  const captureEmotion = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL("image/jpeg").split(",")[1];

    try {
      await axios.post("http://localhost:5000/api/capture-emotion", {
        image: imageBase64,
        userId: authUserId,
        postId: id,
      });
      // Aucun affichage de résultat n'est nécessaire
    } catch (err) {
      console.error("Erreur lors de la capture d'émotion:", err);
    }
  };

  const handleLike = (postId, isLiked) => {
    if (isLiked) {
      dispatch(unlikePost({ postId, authToken }));
    } else {
      dispatch(likePost({ postId, authToken }));
    }
  };

  const handleCommentLike = (commentId, isLiked) => {
    if (isLiked) {
      dispatch(unlikeComment({ commentId, authToken }));
    } else {
      dispatch(likeComment({ commentId, authToken }));
    }
  };

  const handleRetweet = (postId, isRetweeted) => {
    if (isRetweeted) {
      dispatch(unretweetPost({ postId, authToken }));
    } else {
      dispatch(retweetPost({ postId, authToken }));
    }
  };

  const handleCommentSubmit = (postId) => {
    if (!authUserId || !comment) {
      console.error("Utilisateur non authentifié ou commentaire vide");
      return;
    }
    const commentData = { sender: authUserId, post: postId, content: comment };
    dispatch(sendComment({ postId, commentData, authToken }));
    setComment("");
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!post) {
    return <div>Post non trouvé</div>;
  }

  const isLiked = likes[post._id]?.some(like => like.user === authUserId);
  const isRetweeted = post.retweets && post.retweets.some(retweet => retweet.user === authUserId);

  return (
    <div className="post-details">
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <div className="post-actions">
        <button onClick={() => handleLike(post._id, isLiked)} className={isLiked ? "active" : ""}>
          <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes[post._id]?.length || 0}</span>
        </button>
        <button onClick={() => handleRetweet(post._id, isRetweeted)} className={isRetweeted ? "active" : ""}>
          <FontAwesomeIcon icon={faRetweet} /> <span>{retweets[post._id]?.length || 0}</span>
        </button>
        <button onClick={() => setActivePostId(post._id)}>
          <FontAwesomeIcon icon={faComment} /> <span>{comments[post._id]?.length || 0}</span>
        </button>
      </div>

      {/* Éléments cachés pour la capture vidéo */}
      <video ref={videoRef} autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {activePostId === post._id && (
        <div className="comments-section">
          {comments[post._id] && comments[post._id].map((comment) => {
            const isCommentLiked = commentLikes[comment._id]?.some(like => like.user === authUserId);
            return (
              <div key={comment._id} className="comment">
                <p><strong>{comment.sender.name}</strong>: {comment.content}</p>
                <button onClick={() => handleCommentLike(comment._id, isCommentLiked)} className={isCommentLiked ? "active" : ""}>
                  <FontAwesomeIcon icon={faThumbsUp} /> <span>{commentLikes[comment._id]?.length || 0}</span>
                </button>
              </div>
            );
          })}
          <form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(post._id); }}>
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="new-comment-input"
            />
            <button type="submit" className="comment-button">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
