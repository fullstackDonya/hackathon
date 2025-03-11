const Retweet = require('../models/retweetModel');
const Post = require('../models/postModel');
const { createNotification } = require('./notificationController');

const retweetPost = async (req, res) => {
    try {
        const { postId } = req.body;  
        const userId = req.user.id;   

        if (!postId) {
            return res.status(400).json({ message: "L'ID du post est requis" });
        }

        const existingRetweet = await Retweet.findOne({ post: postId, user: userId });
        if (existingRetweet) {
            return res.status(400).json({ message: "Vous avez déjà retweeté ce post" });
        }

        const newRetweet = await Retweet.create({ post: postId, user: userId });

        const post = await Post.findById(postId);
        if (post) {
            await createNotification(post.user, userId, 'retweet', postId);
        }

        res.status(201).json({ message: "Post retweeté avec succès", retweetId: newRetweet._id });
    } catch (err) {
        console.error("Erreur lors du retweet :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const unretweetPost = async (req, res) => {
    try {
        const { postId } = req.body;  
        const userId = req.user.id;   

        if (!postId) {
            return res.status(400).json({ message: "L'ID du post est requis" });
        }

        const existingRetweet = await Retweet.findOne({ post: postId, user: userId });

        if (!existingRetweet) {
            return res.status(400).json({ message: "Vous n'avez pas retweeté ce post" });
        }

        await Retweet.deleteOne({ post: postId, user: userId });

        res.status(200).json({ message: "Retweet supprimé avec succès" });
    } catch (err) {
        console.error("Erreur lors de la suppression du retweet :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { retweetPost, unretweetPost };
