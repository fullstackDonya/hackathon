const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // L'utilisateur qui reçoit la notif
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Celui qui a généré la notif
    type: { 
      type: String, 
      enum: ['like', 'comment', 'retweet', 'follow'], 
      required: true 
    }, // Types de notification
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false }, // Optionnel (likes, commentaires, retweets)
    isRead: { type: Boolean, default: false }, // Notification lue ou non
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;