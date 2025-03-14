// filepath: /Users/donyab/Downloads/Hackathon/frontend/my-app/src/components/Tendances/Tendances.jsx

import React from "react";
import "./css/Tendances.css";

const tendancesData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    title: "Intelligence Artificielle",
    description: "Les avancées révolutionnaires de l'IA en 2025.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1611926653458-09294e6dd5a1",
    title: "Cryptomonnaies",
    description: "Le Bitcoin franchit la barre des 100 000 $.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581090126649-66c5965214c5",
    title: "Énergie Verte",
    description: "L'Europe investit massivement dans l'énergie solaire.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    title: "Sport",
    description: "Les Jeux Olympiques 2025 : tout ce qu'il faut savoir.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f",
    title: "Technologie",
    description: "L'essor des smartphones pliables cette année.",
  },
];

const Tendances = () => {
  return (
    <div className="tendances-section">
      <h3>Actualités Tendances</h3>
      {tendancesData.map((item) => (
        <div key={item.id} className="news-item">
          <img src={item.image} alt={item.title} />
          <div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tendances;
