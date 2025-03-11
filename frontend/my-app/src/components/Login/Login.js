import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../../utils/axiosConfig"; // Importer la configuration Axios
import { setCredentials } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      const { userId, token } = response.data;
      dispatch(setCredentials({ userId, token }));
      navigate("/"); // Rediriger vers la page d'accueil après la connexion
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      alert("Erreur lors de la connexion");
    }
  };
  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
