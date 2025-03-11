const mongoose = require('mongoose');

const signetSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',  // Référence au modèle Post
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Référence au modèle User
      required: true,
    },
  },
  {
    timestamps: true,  // Pour garder une trace de la date de création
  }
);

signetSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Signet', signetSchema);
