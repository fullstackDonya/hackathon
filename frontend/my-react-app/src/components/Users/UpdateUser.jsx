import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/Users.css";

const UpdateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID de l'URL


  useEffect(() => {
    axios
      .get(`http://localhost:8082/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const user = response.data; 

        if (user) {
          setUsername(user.username);
          setEmail(user.email);
         
        } else {
          alert("User non trouvé.");
        }
        setUsername(response.data.username); 
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8082/update/${id}`, 
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        alert("Utilisateur mis à jour avec succès !");
        navigate("/users");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
      });
  };

  return (
    <div>
      <h1>Modifier un utilisateur</h1>
      <form onSubmit={handleUpdate}>
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
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateUser;
