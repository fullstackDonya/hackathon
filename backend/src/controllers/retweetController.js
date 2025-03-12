const Post = require("../models/postModel");
const Notification = require("../models/notificationModel");

const retweetPost = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        if (post.retweets.includes(userId)) {
            return res.status(400).json({ message: "Vous avez déjà retweeté ce post" });
        }

        post.retweets.push(userId);
        await post.save();

        // Créer une notification pour l'auteur du post
        if (post.author.toString() !== userId) {
            const notification = new Notification({
                recipient: post.author,
                sender: userId,
                type: 'retweet',
                post: postId
            });
            await notification.save();
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const unretweetPost = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        const index = post.retweets.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: "Vous n'avez pas retweeté ce post" });
        }

        post.retweets.splice(index, 1);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les retweets d'un post
const getRetweets = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('retweets', 'username');
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        res.status(200).json(post.retweets);
    } catch (error) {
        console.error("Erreur lors de la récupération des retweets :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    retweetPost,
    unretweetPost,
    getRetweets
};