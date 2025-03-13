// models/trendingModel.js
const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema(
  {
    hashtag: { type: String, required: true },
    count: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trending', trendingSchema);
