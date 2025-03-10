const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;