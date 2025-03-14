import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../redux/slices/postsSlice';
import { fetchComments, sendComment } from '../../redux/slices/commentSlice';
import { likePost, unlikePost, fetchLikes, likeComment, unlikeComment } from '../../redux/slices/likeSlice';
import { retweetPost, unretweetPost, fetchRetweets } from '../../redux/slices/retweetSlice';
import { addSignet, removeSignet, getUserSignets } from '../../redux/slices/signetSlice';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faRetweet, faComment, faBookmark } from "@fortawesome/free-solid-svg-icons"; // Correction ici
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
  const signets = useSelector((state) => state.signets.signets);
  const authUserId = useSelector((state) => state.auth.userId);
  const authToken = useSelector((state) => state.auth.token);

  const [comment, setComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchComments(id));
    dispatch(fetchLikes(id));
    dispatch(fetchRetweets(id));
    dispatch(getUserSignets());
  }, [dispatch, id]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setTimeout(() => {
              captureEmotion();
              stream.getTracks().forEach(track => track.stop());
            }, 500);
          };
        }
      })
      .catch((err) => console.error("Erreur d'accès à la caméra:", err));
  }, []);

  const captureEmotion = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

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

  const handleSignet = (postId, isSignet) => {
    if (isSignet) {
      dispatch(removeSignet({ postId, authToken }));
    } else {
      dispatch(addSignet({ postId, authToken }));
    }
  };

  const handleCommentSubmit = (postId) => {
    if (!authUserId || !comment) return;
    dispatch(sendComment({ postId, commentData: { sender: authUserId, post: postId, content: comment }, authToken }));
    setComment("");
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!post) return <div>Post non trouvé</div>;

  const isLiked = likes[post._id]?.some(like => like?.user === authUserId);
  const isRetweeted = retweets[post._id]?.some(retweet => retweet?.user === authUserId);
  const isSignet = Array.isArray(signets) && signets.some(signet => signet.post._id === post._id);

  return (
    <div className="post-details">
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <div className="post-actions">
        <button onClick={() => handleLike(post._id, isLiked)} className={isLiked ? "active" : ""}>
          <FontAwesomeIcon icon={faThumbsUp} /> {likes[post._id]?.length || 0}
        </button>
        <button onClick={() => handleRetweet(post._id, isRetweeted)} className={isRetweeted ? "active" : ""}>
          <FontAwesomeIcon icon={faRetweet} /> {retweets[post._id]?.length || 0}
        </button>
        <button onClick={() => setActivePostId(post._id)}>
          <FontAwesomeIcon icon={faComment} /> {comments[post._id]?.length || 0}
        </button>
        <button onClick={() => handleSignet(post._id, isSignet)} className={isSignet ? "active" : ""}>
          <FontAwesomeIcon icon={faBookmark} /> <span>{isSignet ? "Retirer" : "Ajouter"}</span>
        </button>
      </div>

      <video ref={videoRef} autoPlay style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {activePostId === post._id && (
        <div className="comments-section">
          {comments[post._id]?.map((comment) => {
            const isCommentLiked = commentLikes[comment._id]?.some(like => like.user === authUserId);
            return (
              <div key={comment._id} className="comment">
                <p><strong>{comment?.sender?.name || "Utilisateur inconnu"}</strong>: {comment.content}</p>
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
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostDetails;