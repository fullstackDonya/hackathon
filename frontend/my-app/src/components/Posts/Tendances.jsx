// filepath: /Users/donyab/Downloads/Hackathon/frontend/my-app/src/components/Tendances/Tendances.jsx
import React from "react";
import "./css/Tendances.css";

const Tendances = () => {
  return (
    <div className="tendances-section">
      <h3>Actualités Tendances</h3>
      <div className="news-item">
        <img src="https://via.placeholder.com/150" alt="News 1" />
        <p>Actualité 1: Description de l'actualité 1...</p>
      </div>
      <div className="news-item">
        <img src="https://via.placeholder.com/150" alt="News 2" />
        <p>Actualité 2: Description de l'actualité 2...</p>
      </div>
      <div className="news-item">
        <img src="https://via.placeholder.com/150" alt="News 3" />
        <p>Actualité 3: Description de l'actualité 3...</p>
      </div>
    </div>
  );
};

export default Tendances;