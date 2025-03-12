
import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
          
                <div className="footer-info">
                    <p>Contactez-nous dès aujourd'hui pour en savoir plus sur nos services et comment nous pouvons vous aider.</p>
                    <p>Email : contact@twitter.com</p>
                    <p>Téléphone : +1 234 567 890</p>
                </div>
                <div className="footer-copyright">
                    <p>&copy; 2025. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
