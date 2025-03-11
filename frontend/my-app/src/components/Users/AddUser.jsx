import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Register/Register.css";


const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8082/register",
        { username, email, password },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        alert("Utilisateur ajouté avec succès !");
        navigate("/users");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout :", error);
      });
  };

  return (
    <div className="recipe-form">
      <h1>Ajouter un utilisateur</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
           <input
          type="password"
          placeholder="Mot de passe "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddUser;
