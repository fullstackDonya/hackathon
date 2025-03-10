import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createContact } from "../../redux/slices/contactsSlice";
import "./contacts.css";

const CreateContactForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Ajout du message de succès

  const loading = useSelector((state) => state.contacts.loading);
  const error = useSelector((state) => state.contacts.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createContact({ name, email, message }))
      .then(() => {
        setSuccessMessage(
          "Votre message a bien été envoyé. Nous vous répondrons au plus vite !"
        );
        // Réinitialisation du formulaire
        setName("");
        setEmail("");
        setMessage("");

        // Suppression du message après quelques secondes
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      })
      .catch(() => {
        setSuccessMessage(""); // En cas d'erreur, ne pas afficher le message de succès
      });
  };

  return (
    <div className="create-contact-form">
      <div className="contact-header">
        <h1>Besoin d’aide ? Parlons-en.</h1>
        <p>
          Le burnout peut toucher tout le monde. Si vous ressentez du stress, de
          l’épuisement ou simplement des doutes, n’hésitez pas à contacter un
          professionnel. Psychologues, thérapeutes, médecins, infirmiers et
          coachs en gestion du stress sont là pour vous accompagner.
        </p>
        <p>
          Que ce soit pour de la prévention, des conseils ou un accompagnement
          personnalisé, nous sommes à votre écoute. Posez vos questions,
          exprimez vos inquiétudes et laissez-nous vous guider vers le bien-être.
        </p>
      </div>
      <h2>Créer un nouveau contact</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message :</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Créer"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateContactForm;
