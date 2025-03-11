import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../../redux/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h3><i className="fa-brands fa-twitter"></i></h3>
      </div>
      <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/post" onClick={() => setMenuOpen(false)}>Post</Link></li>
            <li><Link to="/account" onClick={() => setMenuOpen(false)}>Mon Compte</Link></li>
          </>
        )}
        {isAuthenticated ? (
          <li className="logout-button" onClick={handleLogout}>Déconnexion
          </li>
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