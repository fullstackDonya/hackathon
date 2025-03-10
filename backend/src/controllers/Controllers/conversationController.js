const Conversation = require("../Models/conversationModel");
const Message = require("../Models/messageModel");
const { use } = require("../Routes/routes");

const getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createConversation = async (req, res) => {
    try {
        const { senders, createdAt } = req.body;

        if (!senders || senders.length < 2) {
            return res.status(400).json({ message: "Il faut au moins deux utilisateurs pour une conversation" });
        }

        const conversation = new Conversation({ senders, createdAt });
        const savedConversation = await conversation.save();

        // Renvoie la conversation créée avec son ID
        res.status(201).json(savedConversation);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: error.message });
    }
};

const getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id).populate("senders", "username").populate("messages");
        if (!conversation) {
            return res.status(404).json({ message: "Conversation introuvable." });
        }
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserConversations = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        console.log("User ID:", userId); // Log l'ID pour vérifier
        const conversations = await Conversation.find({ senders: userId })
            .populate("senders", "username")
            .populate("messages");

        console.log("Conversations found:", conversations); // Log les conversations trouvées
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error); // Log de l'erreur
        res.status(500).json({ message: error.message });
    }
};


const deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation introuvable." });
        }

        await Message.deleteMany({ conversation: req.params.id });
        await Conversation.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Conversation supprimée." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createConversation,
    getConversationById,
    getUserConversations,
    deleteConversation,
    getAllConversations
};