import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/slices/postsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import "./css/AddPost.css";

const AddPost = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector((state) => state.auth.userId); // Utilisateur connecté
  const authToken = useSelector((state) => state.auth.token); // Token d'authentification
  const [title, setTitle] = useState("");
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!authUserId) {
      console.error("Utilisateur non authentifié");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", newPost);
    formData.append("author", authUserId);
    if (image) {
      formData.append("image", image);
    }
    dispatch(createPost({ formData, authToken }));
    setTitle("");
    setNewPost("");
    setImage(null);
  };

  return (
    <div className="add-post-container">
      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="new-post-input"
        />
        <input
          type="text"
          placeholder="Quoi de neuf ?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="new-post-input"
        />
        <div className="file-input-container">
          <label htmlFor="file-input" className="file-input-label">
            <FontAwesomeIcon icon={faPaperclip} /> Ajouter une image
          </label>
          <input
            type="file"
            id="file-input"
            onChange={(e) => setImage(e.target.files[0])}
            className="file-input"
          />
        </div>
        <button type="submit" className="post-button">
          Poster
        </button>
      </form>
    </div>
  );
};

export default AddPost;