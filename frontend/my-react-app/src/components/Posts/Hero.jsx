import React from "react";
import { Link } from "react-router-dom";
import "./css/Posts.css";

const Hero = () => {
  return (
    <section className="hero">
      <header className="home-header">
        <div className="hero-content">
          <h1>Bienvenue sur l'Appli RebootMind</h1>
          <p>Connectez-vous avec des professionnels pour vous accompagner.</p>
          <Link to="/pro" className="btn-primary">En savoir plus</Link>
        </div>
      </header>
    </section>
  );
};

export default Hero;