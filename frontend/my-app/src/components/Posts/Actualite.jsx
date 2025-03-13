import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { likePost, unlikePost, fetchLikes } from "../../redux/slices/likeSlice";
import { retweetPost, unretweetPost, fetchRetweets } from "../../redux/slices/retweetSlice";
import { addSignet, removeSignet, getUserSignets } from "../../redux/slices/signetSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faRetweet, faTrash, faEdit, faComment, faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./css/Actualite.css";

const Actualite = ({ posts, comments, likes, retweets, signets = [], authUserId, authToken, handleCommentClick, handleCommentSubmit, handleDelete, activePostId, commentLikes, handleCommentLike, comment, setComment }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    posts.forEach(post => {
      dispatch(fetchLikes(post._id));
      dispatch(fetchRetweets(post._id));
    });
    dispatch(getUserSignets());
  }, [dispatch, posts]);

  const handleLike = (postId, isLiked) => {
    if (isLiked) {
      dispatch(unlikePost({ postId, authToken }));
    } else {
      dispatch(likePost({ postId, authToken }));
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

  return (
    <div className="actualite-section">
      <ul>
        {posts.map((post) => {
          const isLiked = likes[post._id]?.some(like => like.user === authUserId);
          const isRetweeted = retweets[post._id]?.some(retweet => retweet.user === authUserId);
          const isSignet = Array.isArray(signets) && signets.some(signet => signet.post._id === post._id);
          return (
            <li key={post._id} className="post-item">
              <a href="#" onClick={() => navigate(`/post/${post._id}`)} className="post-link">
                <p><strong>{post.content}</strong></p>
                <p className="post-date">{new Date(post.createdAt).toLocaleDateString()}</p>
              </a>
              {authUserId && authUserId === post.author._id ? (
                <div className="post-actions">
                  <button onClick={() => navigate(`/post/edit/${post._id}`)}>
                    <FontAwesomeIcon icon={faEdit} /> Modifier
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Supprimer
                  </button>
                </div>
              ) : (
                <div className="post-actions">
                  <button onClick={() => handleLike(post._id, isLiked)} className={isLiked ? "active" : ""}>
                    <FontAwesomeIcon icon={faThumbsUp} /> <span>{likes[post._id]?.length || 0}</span>
                  </button>
                  <button onClick={() => handleRetweet(post._id, isRetweeted)} className={isRetweeted ? "active" : ""}>
                    <FontAwesomeIcon icon={faRetweet} /> <span>{retweets[post._id]?.length || 0}</span>
                  </button>
                  <button onClick={() => handleCommentClick(post._id)}>
                    <FontAwesomeIcon icon={faComment} /> <span>{comments[post._id]?.length || 0}</span>
                  </button>
                  <button onClick={() => handleSignet(post._id, isSignet)} className={isSignet ? "active" : ""}>
                    <FontAwesomeIcon icon={faBookmark} /> <span>{isSignet ? "Retirer" : "Ajouter"}</span>
                  </button>
                </div>
              )}
              {post._id === activePostId && (
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Actualite;