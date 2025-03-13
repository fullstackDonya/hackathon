import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrending } from '../../redux/slices/trendingSlice';
import './css/Tendances.css';

const Tendances = () => {
  const dispatch = useDispatch();
  const trending = useSelector((state) => state.trending.list);
  const loading = useSelector((state) => state.trending.loading);
  const error = useSelector((state) => state.trending.error);

  useEffect(() => {
    dispatch(fetchTrending());
  }, [dispatch]);

  return (
    <div className="tendances-container">
      <h3>Tendances</h3>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p>Erreur : {error}</p>
      ) : (
        <ul>
          {trending.map((item) => (
            <li key={item._id} className="trending-item">
              <div className="hashtag">#{item.hashtag}</div>
              <div className="post-count">{item.count} posts</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tendances;