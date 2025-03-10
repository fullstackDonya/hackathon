const Question = require('../Models/QuestionModel');
const Diagnostic = require('../Models/DiagnosticModel');


// Récupérer toutes les questions du diagnostic
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Soumettre les réponses du diagnostic
const submitDiagnostic = async (req, res) => {
    const { userId, responses } = req.body;

    try {
        const diagnostic = new Diagnostic({ userId, responses });
        await diagnostic.save();
        res.status(201).json({ message: 'Diagnostic soumis avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getQuestions,
    submitDiagnostic

}
