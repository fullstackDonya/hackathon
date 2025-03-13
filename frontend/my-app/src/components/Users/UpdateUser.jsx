import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUser } from "../../redux/slices/usersSlice";
import "./css/Users.css";

const UpdateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID de l'URL
  const user = useSelector((state) => state.users.user);
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setAge(user.age);
    }
  }, [user]);

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id, username, email, firstname, lastname, age, authToken }))
      .then(() => {
        alert("Utilisateur mis à jour avec succès !");
        navigate("/account");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
      });
  };

  return (
    <div className="update-user-container">
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
        <input
          type="text"
          placeholder="Prénom"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateUser;