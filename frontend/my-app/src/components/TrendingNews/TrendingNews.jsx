import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { searchPosts } from "../../redux/slices/searchSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./css/TrendingNews.css";

const TrendingNews = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchPosts(searchQuery));
  };

  return (
    <div className="news-section">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Rechercher des posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <div className="trending-news">
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
    </div>
  );
};

export default TrendingNews;