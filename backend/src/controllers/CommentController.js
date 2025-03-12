const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

const sendComment = async (req, res) => {
    try {
        const { sender, post, content } = req.body;

        if (!sender || !post || !content) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const newComment = new Comment({ sender, post, content });
        const savedComment = await newComment.save();

        // Ajouter le commentaire au post
        await Post.findByIdAndUpdate(post, {
            $push: { comments: savedComment._id }
        });

        // Envoyer le commentaire en temps réel via WebSocket
        const io = req.app.get("io"); // Récupérer `io` depuis `app.js` 
        io.to(post).emit("newComment", savedComment);

        res.status(201).json(savedComment);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer tous les commentaires (⚠️ Généralement, ce n'est pas recommandé en production)
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate("sender", "name");
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
  
    try {
      // Vérifier si le post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé' });
      }

      // Récupérer les commentaires liés à ce post
      const comments = await Comment.find({ post: postId }) // Utilisation correcte du champ "post"
        .populate('sender', 'name') // Populate pour afficher les noms des utilisateurs
        .sort({ createdAt: 1 }); // Trie par date croissante (optionnel)

      console.log("🔍 Commentaires en base :", comments);
      
      res.status(200).json(comments);  // Retourner les commentaires
    } catch (error) {
      console.error("Erreur serveur :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer un seul commentaire par ID
const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire introuvable." });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau commentaire
const createComment = async (req, res) => {
    try {
        const { sender, post, content } = req.body;

        if (!sender || !post || !content) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        const comment = new Comment({ sender, post, content });
        await comment.save();

        // Renvoie le commentaire créé
        res.status(201).json(comment);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un commentaire
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire introuvable." });
        }

        if (req.body.content) {
            comment.content = req.body.content;
        }

        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un commentaire
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire introuvable." });
        }

        await Comment.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Commentaire supprimé." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    sendComment,
    getCommentsByPostId
};