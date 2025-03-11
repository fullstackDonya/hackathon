const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Assurer qu'un utilisateur ne puisse liker qu'une seule fois un post/commentaire
likeSchema.index({ post: 1, comment: 1, user: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
