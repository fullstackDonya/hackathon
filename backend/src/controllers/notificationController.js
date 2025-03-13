const Notification = require('../models/notificationModel');

const createNotification = async (recipient, sender, type, postId = null) => {
    try {
        const notification = new Notification({
            recipient,
            sender,
            type,
            post: postId,
        });
        await notification.save();
        console.log("Notification créée avec succès :", notification);
    } catch (error) {
        console.error("Erreur lors de la création de la notification :", error);
    }
};

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'username')
            .populate('post', 'content')
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ message: "Notification marquée comme lue" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la notification :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
        res.status(200).json({ message: "Toutes les notifications ont été marquées comme lues" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des notifications :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
};