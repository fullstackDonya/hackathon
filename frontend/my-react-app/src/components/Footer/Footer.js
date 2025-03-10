
import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <ul className="footer-links">
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Twitter</a></li>
                    <li><a href="#">LinkedIn</a></li>
                    <li><a href="#">Instagram</a></li>
                </ul>
                <div className="footer-info">
                    <p>Contactez-nous dès aujourd'hui pour en savoir plus sur nos services et comment nous pouvons vous aider.</p>
                    <p>Email : contact@burnoutprevention.com</p>
                    <p>Téléphone : +1 234 567 890</p>
                </div>
                <div className="footer-copyright">
                    <p>&copy; 2025 Burn-out Prevention. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
