import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./css/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const userRole = useSelector((state) => state.auth.role); 


  useEffect(() => {
    axios
      .get("http://localhost:8082/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data); 
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      });
  }, [token]);

  const handleAdd = () => {
    navigate("/add_user");
  };

  const handleEdit = (id) => {
    navigate(`/edit_user/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      axios
        .delete(`http://localhost:8080/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          alert("Utilisateur supprimé avec succès !");
          // Mettre à jour la liste des utilisateurs après suppression
          setUsers(users.filter((user) => user._id !== id)); 
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
        });
    }
  };
  // vérification du rôle de l'utilisateur si Non admin ne peut pas voir la page
  // if (userRole !== 'admin') {
  //   return <div>Vous n'êtes pas autorisé à voir cette page.</div>;
  // }
  return (
    <div>
      <h1>Liste des Utilisateurs</h1>
      <button className="add" onClick={handleAdd}>
        Ajouter un utilisateur
      </button>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Modifier</th>
            <th>Effacer</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}> 
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button className="update" onClick={() => handleEdit(user._id)}>
                  Modifier
                </button>
              </td>
              <td>
                <button className="delete" onClick={() => handleDelete(user._id)}>
                  Effacer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
