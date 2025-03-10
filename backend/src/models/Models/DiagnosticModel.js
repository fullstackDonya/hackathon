const mongoose = require('mongoose');

const DiagnosticSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Lien vers l'utilisateur
    responses: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: [{ type: String, required: true }] 
    }],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diagnostic', DiagnosticSchema);
