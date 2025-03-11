import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="content">
        <i className="fab fa-twitter fa-5x"></i>
        <div className="links">
          <a href="/signup" className="link">S'inscrire</a>
          <a href="/login" className="link">Se connecter</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
