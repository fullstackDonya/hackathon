// controllers/trendingController.js
const Post = require('../models/postModel');
const Trending = require('../models/trendingModel');

const calculateTrendingHashtags = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // Récupérer les posts créés dans les dernières 24h
    const posts = await Post.find({ createdAt: { $gte: twentyFourHoursAgo } });

    const hashtagCounts = {};

    posts.forEach(post => {
      const content = post.content;
      // Utilisation d'une regex qui gère aussi les caractères accentués
      const regex = /#([\wÀ-ÖØ-öø-ÿ]+)/g;
      let match;
      const uniqueHashtags = new Set();

      while ((match = regex.exec(content)) !== null) {
        // On normalise en minuscules pour compter de façon uniforme
        uniqueHashtags.add(match[1].toLowerCase());
      }

      // Chaque hashtag unique dans le post est compté une seule fois
      uniqueHashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });

    // Transformation en tableau, tri décroissant et sélection des 10 premiers
    const trending = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([hashtag, count]) => ({ hashtag, count }));

    // Mise à jour de la collection "tendances"
    await Trending.deleteMany({});
    await Trending.insertMany(trending);

    console.log('Hashtags tendances mis à jour :', trending);
  } catch (error) {
    console.error('Erreur lors du calcul des tendances :', error);
  }
};

const getTrendingHashtags = async (req, res) => {
  try {
    const trending = await Trending.find().sort({ count: -1 });
    res.status(200).json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { calculateTrendingHashtags, getTrendingHashtags };
