import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionalUsers } from '../../redux/slices/usersSlice';
import './css/professional.css';

const Professional = () => {
  const dispatch = useDispatch();
  const professionalUsers = useSelector((state) => state.users.list);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchProfessionalUsers());
  }, [dispatch]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="professional-container">
      <h2>Professionnels</h2>
      <ul>
        {professionalUsers.map((user) => (
          <li key={user._id}>
            <p>Nom : {user.username}</p>
            <p>Rôle : {user.role}</p>
            {/* Ajoutez d'autres informations utilisateur ici */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Professional;