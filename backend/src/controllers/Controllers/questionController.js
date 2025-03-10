const Question = require('../Models/QuestionModel');

// Récupérer toutes les questions
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les questions par catégorie
const getQuestionsByCategory = async (req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer une question par ID
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Créer une nouvelle question
const createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Mettre à jour une question par ID
const updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer une question par ID
const deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question non trouvée" });
        }
        res.status(200).json({ message: "Question supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    getQuestions,
    getQuestionsByCategory,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
};