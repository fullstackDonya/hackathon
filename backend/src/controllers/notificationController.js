const Notification = require('../models/notificationModel');

// Créer une notification
const createNotification = async (req, res) => {
    try {
        const { user, type, post, sender } = req.body;

        const notification = new Notification({ user, type, post, sender });
        const savedNotification = await notification.save();

        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les notifications d'un utilisateur
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Marquer une notification comme lue
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Marquer toutes les notifications comme lues
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
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