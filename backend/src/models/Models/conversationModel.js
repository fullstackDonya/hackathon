const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    senders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Participants
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Liste des messages liés
    createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
