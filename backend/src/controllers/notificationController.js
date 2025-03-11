const Notification = require('../models/notificationModel');

// 📩 Créer une notification
const createNotification = async (recipientId, senderId, type, postId = null) => {
    try {
        // Vérifie si une notification similaire existe déjà pour éviter les doublons
        const existingNotification = await Notification.findOne({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId
        });

        if (!existingNotification) {
            await Notification.create({
                recipient: recipientId,
                sender: senderId,
                type,
                post: postId
            });
        }
    } catch (err) {
        console.error("Erreur lors de la création de la notification :", err);
    }
};

// 🔔 Récupérer les notifications d'un utilisateur
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // ID de l'utilisateur connecté

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 }) 
            .populate('sender', 'username')
            .populate('post', 'content');

        res.status(200).json(notifications);
    } catch (err) {
        console.error("Erreur lors de la récupération des notifications :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Marquer une notification comme lue
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ message: "Notification marquée comme lue" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la notification :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Marquer toutes les notifications comme lues
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });

        res.status(200).json({ message: "Toutes les notifications ont été marquées comme lues" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour des notifications :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { createNotification, getNotifications, markAsRead, markAllAsRead };
