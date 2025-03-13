const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');  // Si tu as un modèle utilisateur
const { createNotification } = require('./notificationController');

// S'abonner à un autre utilisateur
const followUser = async (req, res) => {
    try {
        const { userId } = req.body;  
        const followerId = req.user.id;  

        if (!userId) {
            return res.status(400).json({ message: "L'ID de l'utilisateur à suivre est requis" });
        }

        if (userId === followerId) {
            return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même" });
        }

        const existingSubscription = await Subscription.findOne({ follower: followerId, following: userId });
        if (existingSubscription) {
            return res.status(400).json({ message: "Vous suivez déjà cet utilisateur" });
        }

        await Subscription.create({ follower: followerId, following: userId });

        await createNotification(userId, followerId, 'follow');

        res.status(201).json({ message: "Abonnement réussi" });
    } catch (err) {
        console.error("Erreur lors de l'abonnement :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Se désabonner d'un autre utilisateur
const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.body;  // ID de l'utilisateur à ne plus suivre
        const followerId = req.user.id;  // ID de l'utilisateur qui se désabonne

        // Vérifier si l'utilisateur suit déjà cet utilisateur
        const existingSubscription = await Subscription.findOne({ follower: followerId, following: userId });
        if (!existingSubscription) {
            return res.status(400).json({ message: "Vous ne suivez pas cet utilisateur" });
        }

        // Supprimer l'abonnement
        await Subscription.deleteOne({ follower: followerId, following: userId });

        res.status(200).json({ message: "Désabonnement réussi" });
    } catch (err) {
        console.error("Erreur lors du désabonnement :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer la liste des utilisateurs suivis par un utilisateur
const getFollowing = async (req, res) => {
    try {
        const userId = req.user.id; 

        const following = await Subscription.find({ follower: userId }).populate('following', 'username');
        
        res.status(200).json(following);
    } catch (err) {
        console.error("Erreur lors de la récupération des abonnements :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getFollowers = async (req, res) => {
    try {
        const userId = req.user.id;  

        const followers = await Subscription.find({ following: userId }).populate('follower', 'username');
        
        res.status(200).json(followers);
    } catch (err) {
        console.error("Erreur lors de la récupération des abonnés :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { followUser, unfollowUser, getFollowing, getFollowers };