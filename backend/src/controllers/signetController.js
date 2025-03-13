const Signet = require('../models/signetModel');
const Post = require('../models/postModel');
const { createNotification } = require('./notificationController');

// Ajouter un signet pour un post
const addSignet = async (req, res) => {
    try {
        const { postId } = req.body;  // L'ID du post à enregistrer est passé dans le body
        const userId = req.user.id;   // Récupère l'ID de l'utilisateur depuis le token (authMiddleware)

        if (!postId) {
            return res.status(400).json({ message: "L'ID du post est requis" });
        }

        // Vérifier si le signet existe déjà (si l'utilisateur a déjà enregistré ce post)
        const existingSignet = await Signet.findOne({ post: postId, user: userId });
        if (existingSignet) {
            return res.status(400).json({ message: "Vous avez déjà enregistré ce post" });
        }

        // Créer un nouveau signet
        const newSignet = new Signet({
            post: postId,
            user: userId,
        });

        await newSignet.save();

        // Créer une notification pour l'ajout du signet
        const post = await Post.findById(postId).populate('user');
        if (post) {
            createNotification(post.user._id, userId, 'signet', postId);
        }

        res.status(201).json({ message: "Post enregistré avec succès dans les signets" });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement du post :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer un signet d'un post
const removeSignet = async (req, res) => {
    try {
        const { postId } = req.body;  // Récupère l'ID du post à partir du body
        const userId = req.user.id;   // Récupère l'ID de l'utilisateur depuis le middleware d'authentification

        if (!postId) {
            return res.status(400).json({ message: "L'ID du post est requis" });
        }

        // Chercher le signet pour ce post et utilisateur
        const signet = await Signet.findOne({ post: postId, user: userId });

        if (!signet) {
            return res.status(404).json({ message: "Ce post n'est pas dans vos signets" });
        }

        // Supprimer le signet
        await Signet.deleteOne({ post: postId, user: userId });

        res.status(200).json({ message: "Signet supprimé avec succès" });
    } catch (err) {
        console.error("Erreur lors de la suppression du signet :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer la liste des posts enregistrés (signets) pour un utilisateur
const getUserSignets = async (req, res) => {
    try {
        const userId = req.user.id;  // Récupère l'ID de l'utilisateur depuis le middleware d'authentification

        // Trouver tous les signets associés à cet utilisateur
        const signets = await Signet.find({ user: userId })
            .populate('post')  // Peupler les données du post dans chaque signet
            .populate('user')  // Peupler les données de l'utilisateur dans chaque signet
            .exec();

        if (signets.length === 0) {
            return res.status(404).json({ message: "Aucun post enregistré trouvé" });
        }

        // Retourner la liste des posts enregistrés
        res.status(200).json({ signets });
    } catch (err) {
        console.error("Erreur lors de la récupération des signets :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { addSignet, removeSignet, getUserSignets };