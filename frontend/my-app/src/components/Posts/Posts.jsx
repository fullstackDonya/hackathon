import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts, deletePost, createPost } from "../../redux/slices/postsSlice";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { fetchComments, sendComment } from "../../redux/slices/commentSlice";
import { fetchLikes, likeComment, unlikeComment } from "../../redux/slices/likeSlice";
import { fetchSignets } from "../../redux/slices/signetSlice";
import Actualite from "../Posts/Actualite";
import Tendances from "../Posts/Tendances";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faCompass } from "@fortawesome/free-solid-svg-icons";
import "./css/Posts.css";


const Posts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const authUserId = useSelector((state) => state.auth.userId); // Utilisateur connecté
  const authToken = useSelector((state) => state.auth.token); // Token d'authentification
  const comments = useSelector((state) => state.comments.comments);
  const likes = useSelector((state) => state.likes.likes);
  const commentLikes = useSelector((state) => state.likes.commentLikes);
  const retweets = useSelector((state) => state.retweets.retweets);
  const signets = useSelector((state) => state.signets.signets);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [showActualite, setShowActualite] = useState(true);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(fetchSignets());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        dispatch(fetchComments(post._id));
        dispatch(fetchLikes(post._id));
      });
    }
  }, [posts, dispatch]);



  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleToggle = () => {
    setShowActualite(!showActualite);
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

  const handleCommentLike = (commentId, isLiked) => {
    if (isLiked) {
      dispatch(unlikeComment({ commentId, authToken }));
    } else {
      dispatch(likeComment({ commentId, authToken }));
    }
  };

  return (
    <div className="container-posts">
      <div className="main-content">
        <div className="toggle-section">
          <button onClick={handleToggle} className={showActualite ? "active" : ""}>
            <FontAwesomeIcon icon={faNewspaper} /> Actualité
          </button>
          <button onClick={handleToggle} className={!showActualite ? "active" : ""}>
            <FontAwesomeIcon icon={faCompass} /> Explorer
          </button>
        </div>
 
        {showActualite ? (
          <Actualite
            posts={posts}
            comments={comments}
            likes={likes}
            retweets={retweets}
            signets={signets}
            authUserId={authUserId}
            authToken={authToken}
            handleCommentClick={setActivePostId}
            handleCommentSubmit={handleCommentSubmit}
            handleDelete={handleDelete}
            activePostId={activePostId}
            commentLikes={commentLikes}
            handleCommentLike={handleCommentLike}
            comment={comment}
            setComment={setComment}
          />
        ) : (
          <Tendances />
        )}

      </div>
    </div>
  );
};

export default Posts;