import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, deleteContact } from '../../redux/slices/contactsSlice';
import './contacts.css';

const Contacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.list);
  const loading = useSelector((state) => state.contacts.loading);
  const error = useSelector((state) => state.contacts.error);
  const userRole = useSelector((state) => state.auth.role); 

  useEffect(() => {
    if (userRole === 'admin') {
      dispatch(fetchContacts());
    }
  }, [dispatch, userRole]);

  if (userRole !== 'admin') {
    return <div>Vous n'êtes pas autorisé à voir cette page.</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="contacts-container">
      <h2>Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact._id}>
            <p>Nom : {contact.name}</p>
            <p>Email : {contact.email}</p>
            <p>Message : {contact.message}</p>
            <button onClick={() => handleDelete(contact._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;