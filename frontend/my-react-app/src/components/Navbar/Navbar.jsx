import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from '../Logout/Logout';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        {/* <img src="/logo.svg" alt="Logo" /> */}
        <h3>RebootMind</h3>
      </div>
      <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* NAVIGATION LINKS */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/conversations" onClick={() => setMenuOpen(false)}>Conversations</Link></li>
            <li><Link to="/account" onClick={() => setMenuOpen(false)}>Mon Compte</Link></li>
          </>
        )}
        <li><Link to="/pro" onClick={() => setMenuOpen(false)}>Professionnels</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        {/* <li><Link to="/users" onClick={() => setMenuOpen(false)}>Gestion des Utilisateurs</Link></li> */}

        {isAuthenticated ? (
          <li><Logout /></li>
        ) : (
          <>
            <li><Link to="/register" onClick={() => setMenuOpen(false)}>Inscription</Link></li>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;