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

retweetSchema.index({ user: 1, post: 1 }, { unique: true });
module.exports = mongoose.model('Retweet', retweetSchema);