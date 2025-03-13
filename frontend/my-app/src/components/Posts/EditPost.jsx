import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Utilisez l'instance axios préconfigurée
import MyAxios from "../../utils/axiosConfig";
import "./css/EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupère les données du post à éditer lors du montage du composant
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await MyAxios.get(`/post/${id}`);
        const post = response.data;
        setTitle(post.title || "");
        setContent(post.content || "");
        setImagePreview(post.image || "");
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du GET /post/:id", err);
        setError("Erreur lors du chargement du post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Gestion du changement de fichier image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion de la soumission du formulaire de modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prépare les données à envoyer via FormData pour gérer l'upload de fichier
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await MyAxios.put(`/post/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Redirection vers la page compte après la modification
      navigate("/account");
    } catch (err) {
      console.error("Erreur lors du PUT /post/:id", err);
      setError("Erreur lors de la mise à jour du post");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="edit-post-container">
      <h1>Modifier le Post</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imagePreview && (
        <img src={imagePreview} alt="Aperçu" className="edit-post-image" />
      )}
      <form className="edit-post-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre :</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Contenu :</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
          />
        </div>
        <div>
          <label htmlFor="image">Image :</label>
          <input id="image" type="file" onChange={handleImageChange} />
        </div>
        <div className="edit-post-actions">
          <button type="submit">Enregistrer les modifications</button>
          <button
            type="button"
            className="cancel"
            onClick={() => navigate("/account")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
