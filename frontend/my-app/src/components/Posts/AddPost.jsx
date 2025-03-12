import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/slices/postsSlice";
import "./css/AddPost.css";

const AddPost = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector((state) => state.auth.userId); // Utilisateur connecté
  const authToken = useSelector((state) => state.auth.token); // Token d'authentification
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!authUserId) {
      console.error("Utilisateur non authentifié");
      return;
    }
    const formData = new FormData();
    formData.append("content", newPost);
    formData.append("author", authUserId);
    if (image) {
      formData.append("image", image);
    }
    dispatch(createPost({ formData, authToken }));
    setNewPost("");
    setImage(null);
  };

  return (
    <div className="add-post-container">
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
    </div>
  );
};

export default AddPost;