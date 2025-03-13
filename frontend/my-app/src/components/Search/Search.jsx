import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchPosts, clearSearchResults } from '../../redux/slices/searchSlice';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const results = useSelector((state) => state.search.results);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchPosts(query));
    }
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearchResults());
  };

  return (
 

    <div className="search-container">
        <h3>Rechercher des posts</h3>
   
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des posts..."
        />
        <button type="submit">Rechercher</button>
        <button type="button" onClick={handleClear}>Effacer</button>
      </form>
      <div className="search-results">
        {results.map((result) => (
          <div key={result.id} className="search-result-item">
            {result.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;