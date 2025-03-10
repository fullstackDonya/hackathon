import React from 'react';
import './css/Presentation.css';
const Presentation = () => {
    return (
        <div>
            <header>
                <h1>Présentation</h1>
                <p>Bienvenue sur notre page de présentation. Découvrez comment nous pouvons vous aider à prévenir et à surmonter le burn-out.</p>
            </header>

            <section>
                <h2>Qu'est-ce que le burn-out ?</h2>
                <p>Le burn-out est un état d'épuisement physique, émotionnel et mental causé par un stress excessif et prolongé.</p>
            </section>

            <section>
                <h2>Nos Services</h2>
                <p>Nous offrons une gamme de services pour aider à prévenir et à traiter le burn-out :</p>
                <ul>
                    <li>Consultations individuelles</li>
                    <li>Ateliers de gestion du stress</li>
                    <li>Programmes de bien-être en entreprise</li>
                </ul>
            </section>

            <section>
                <h2>Étapes pour Prévenir le Burn-out</h2>
                <ol>
                    <li>Reconnaître les signes avant-coureurs</li>
                    <li>Adopter une routine de bien-être</li>
                    <li>Établir des limites claires entre le travail et la vie personnelle</li>
                    <li>Pratiquer des techniques de relaxation</li>
                    <li>Consulter un professionnel si nécessaire</li>
                </ol>
            </section>

            <section>
                <h2>Comment Nous Pouvons Aider</h2>
                <p>Nos experts sont là pour vous accompagner à chaque étape :</p>
                <ul>
                    <li>Évaluation personnalisée de votre situation</li>
                    <li>Plan de prévention sur mesure</li>
                    <li>Suivi régulier et ajustements</li>
                </ul>
            </section>

            <footer>
                <p>Contactez-nous dès aujourd'hui pour en savoir plus sur nos services et comment nous pouvons vous aider.</p>
            </footer>
        </div>
    );
};

export default Presentation;