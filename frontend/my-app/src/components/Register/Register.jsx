import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = () => {
    const createdAt = new Date().toISOString(); // Obtenir la date et l'heure actuelles
    dispatch(register({ email, password, username, firstname, lastname, createdAt }))
      .unwrap()
      .then(() => {
        alert("Compte créé avec succès");
        navigate("/");
      })
      .catch((err) => {
        alert("Erreur lors de la création du compte");
        console.error("Erreur lors de la création du compte :", err);
      });
  };

  return (
    <div className="register-form">
      <h1>Inscription</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Prénom"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nom"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Enregistrement..." : "Continuer"}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="links">
        <Link to="/login">Se connecter</Link>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    </div>
  );
};

export default Register;