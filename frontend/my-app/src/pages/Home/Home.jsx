import React from 'react';
import { useSelector } from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Logout from '../../components/Logout/Logout';
import './Home.css';

const Home = () => {
  // Utiliser useSelector pour vérifier si l'utilisateur est connecté
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  return (
    <div className="home">
      <div className="content">
        <i className="fab fa-twitter fa-5x"></i>
        <h1>Hackaton 2025 G.18</h1>

        <div className="card-container">
          <a href="/register" className="card">
            <i className="fas fa-user-plus"></i>
            <h3>Creer un compte</h3>
            <p>Rejoignez-nous dès aujourd'hui !</p>
          </a>

          {isAuthenticated ? (
            <a href="/logout" className="card">
              <i className="fas fa-sign-out-alt"></i>
              <h3 className='btn-logout'><Logout /></h3> 
              <p>Déconnectez-vous de votre compte.</p>
            </a>
          ) : (
            <a href="/login" className="card">
              <i className="fas fa-sign-in-alt"></i>
              <h3>Connexion</h3>
              <p>Accédez à votre compte.</p>
            </a>
          )}

          <a href="/favorites" className="card">
            <i className="fas fa-heart"></i>
            <h3>Favoris</h3>
            <p>Retrouvez vos posts préférés.</p>
          </a>

          <a href="/post" className="card">
            <i className="fas fa-compass"></i>
            <h3>Explorer</h3>
            <p>Découvrez de nouveaux contenus.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;