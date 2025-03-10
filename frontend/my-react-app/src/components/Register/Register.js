import axios, { AxiosHeaders } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    axios
      .post("http://localhost:8082/register", {
        email: email,
        password: password,
        username: username,
        firstname: firstname,
        lastname: lastname,
      })
      .then((response) => {
        alert("Compte crée avec succès");
        navigate("/");
        
      })
      .catch((error) => {
        alert("Erreur lors de la création du compte");
        console.log('====================================');
        console.log(email, password, username);
        console.log('====================================');
      });
  };

  return (
    <div className="register-form">
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lastname"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        type="text"
        placeholder="FirstName"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
