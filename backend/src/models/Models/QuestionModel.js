const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true }, 
    options: [{ type: String }], 
    category: { type: String, enum: ['prevention', 'diagnostic', 'recovery'], required: true } // Catégorie de la question
});

module.exports = mongoose.model('Question', QuestionSchema);