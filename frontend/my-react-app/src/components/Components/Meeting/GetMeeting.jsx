import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./meeting.css";

const GetMeeting = () => {
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté pour voir ce meeting.");
      return;
    }

    axios
      .get(`http://localhost:8080/meeting/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const meeting = response.data;
        if (meeting) {
          setTitle(meeting.title);
          setCreatedAt(new Date(meeting.createdAt).toLocaleString());
        } else {
          setError("Meeting non trouvé.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du meeting:", error);
        setError("Impossible de charger les données du meeting.");
      });
  }, [id, token]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="meeting-form">
      <h1>Détails du Meeting</h1>
      <div>
        <label>Titre:</label>
        <input type="text" value={title} disabled />

        <label>Date de création:</label>
        <input type="text" value={createdAt} disabled />
      </div>
    </div>
  );
};

export default GetMeeting;
