import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../../redux/slices/postsSlice";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { fetchComments, sendComment } from "../../redux/slices/commentSlice";
import { fetchLikes, unlikeComment, likeComment } from "../../redux/slices/likeSlice";
import { getUserSignets } from "../../redux/slices/signetSlice";
import Actualite from "../../components/Posts/Actualite";
import Tendances from "../../components/Posts/Tendances";
import Search from "../../components/Search/Search";
import AddPost from "../../components/Posts/AddPost";
import UsersToFollow from "../../components/Users/UsersToFollow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faCompass } from "@fortawesome/free-solid-svg-icons";
import "./PostsPage.css";

const PostsPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const authUserId = useSelector((state) => state.auth.userId);
  const authToken = useSelector((state) => state.auth.token);
  const comments = useSelector((state) => state.comments.comments);
  const likes = useSelector((state) => state.likes.likes);
  const commentLikes = useSelector((state) => state.likes.commentLikes);
  const retweets = useSelector((state) => state.retweets.retweets);
  const signets = useSelector((state) => state.signets.signets) || [];
  const [showActualite, setShowActualite] = useState(true);
  const [activePostId, setActivePostId] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchUsers());
    dispatch(getUserSignets());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        dispatch(fetchComments(post._id));
        dispatch(fetchLikes(post._id));
      });
    }
  }, [posts, dispatch]);

  const handleToggle = () => {
    setShowActualite(!showActualite);
  };

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
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
    <div className="posts-page-container">
      <div className="main-content">
        <div className="left-section">
          <div className="toggle-section">
            <button onClick={handleToggle} className={showActualite ? "active" : ""}>
              <FontAwesomeIcon icon={faNewspaper} /> Actualité
            </button>
            <button onClick={handleToggle} className={!showActualite ? "active" : ""}>
              <FontAwesomeIcon icon={faCompass} /> Explorer
            </button>
          </div>
          <Search />
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
        <div className="center-section">
          <AddPost />
        </div>
        <div className="right-section">
          <UsersToFollow />
        </div>
      </div>
    </div>
  );
};

export default PostsPage;