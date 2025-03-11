const mongoose = require('mongoose');

const retweetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
}, { timestamps: true });

retweetSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Retweet', retweetSchema);
