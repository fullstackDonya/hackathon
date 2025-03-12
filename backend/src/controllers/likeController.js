const Like = require('../models/likeModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel'); 
const { createNotification } = require('./notificationController');

const like = async (req, res) => {
    try {
        const { postId, commentId } = req.body; 
        const userId = req.user.id;

        if (!postId && !commentId) {
            return res.status(400).json({ message: "L'ID du post ou du commentaire est requis" });
        }

        const existingLike = await Like.findOne({ 
            user: userId, 
            ...(postId ? { post: postId } : { comment: commentId }) 
        });

        if (existingLike) {
            return res.status(400).json({ message: "Vous avez déjà liké cet élément" });
        }

        const like = await Like.create({
            user: userId,
            post: postId || null,
            comment: commentId || null,
        });

        if (postId) {
            const post = await Post.findById(postId).populate('author');
            if (post) {
                await createNotification(post.author._id, userId, 'like', postId);
            }
        } else if (commentId) {
            const comment = await Comment.findById(commentId).populate('sender');
            if (comment) {
                await createNotification(comment.sender._id, userId, 'like', commentId);
            }
        }

        res.status(201).json({ message: "Like ajouté avec succès", user: userId });
    } catch (err) {
        console.error("Erreur lors du like :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les likes d'un post
const getLikes = async (req, res) => {
    try {
        const { postId } = req.params;
        const likes = await Like.find({ post: postId }).populate('user', 'username');
        res.status(200).json(likes);
    } catch (err) {
        console.error("Erreur lors de la récupération des likes :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les likes d'un commentaire
const getCommentLikes = async (req, res) => {
    try {
        const { commentId } = req.params;
        const likes = await Like.find({ comment: commentId }).populate('user', 'username');
        res.status(200).json(likes);
    } catch (err) {
        console.error("Erreur lors de la récupération des likes :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Retirer un like (post ou commentaire)
const unlike = async (req, res) => {
    try {
        const { postId, commentId } = req.body; 
        const userId = req.user.id;

        if (!postId && !commentId) {
            return res.status(400).json({ message: "L'ID du post ou du commentaire est requis" });
        }

        const existingLike = await Like.findOne({
            user: userId, 
            ...(postId ? { post: postId } : { comment: commentId }) 
        });

        if (!existingLike) {
            return res.status(400).json({ message: "Vous n'avez pas liké cet élément" });
        }

        // Suppression du like
        await Like.deleteOne({ _id: existingLike._id });

        res.status(200).json({ message: "Like supprimé avec succès", user: userId });
    } catch (err) {
        console.error("Erreur lors de la suppression du like :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { like, unlike, getLikes, getCommentLikes };