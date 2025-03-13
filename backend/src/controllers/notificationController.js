const Notification = require('../models/notificationModel');
const { sendNotification } = require('../websocket');
// Créer une notification
const createNotification = async (recipient, sender, type, post) => {
    try {
        console.log("Création de la notification pour :", recipient, sender, type, post);
        const notification = new Notification({ recipient, sender, type, post });
        await notification.save();
        console.log("Notification créée avec succès :", notification);
        
        // Envoyer la notification via WebSocket
        sendNotification(recipient, notification);
    } catch (error) {
        console.error("Erreur lors de la création de la notification :", error);
    }
};

// Récupérer les notifications d'un utilisateur
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Marquer une notification comme lue
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Marquer toutes les notifications comme lues
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
        res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
};