import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './css/account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Account = () => {
  const [user, setUser] = useState(null);
  const userId = useSelector((state) => state.auth.userId); // Récupérer l'ID de l'utilisateur connecté depuis l'état Redux
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/user/${userId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  const handleNavigateToAppointments = () => {
    navigate('/appointments');
  };

  const handleCreateAppointment = () => {
    navigate('/new_appointment'); 
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Mon Compte</h2>
      </div>
      <div className="account-info">
        <p>Nom d'utilisateur: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
      <div className="account-actions">
        <button onClick={handleNavigateToAppointments} className="appointments-button">
          Voir mes rendez-vous
        </button>
        <button onClick={handleCreateAppointment} className="create-appointment-button">
          <FontAwesomeIcon icon={faPlus} /> Nouveau rendez-vous
        </button>
      </div>
    </div>
  );
};

export default Account;