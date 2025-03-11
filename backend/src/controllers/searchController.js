const Post = require('../models/postModel');

const searchPosts = async (req, res) => {
    try {
        const { searchTerm } = req.query; 

        if (!searchTerm) {
            return res.status(400).json({ message: "Veuillez fournir un terme de recherche" });
        }

        // Recherche des posts contenant le terme de recherche dans leur contenu (en ignorant la casse)
        const posts = await Post.find({
            content: { $regex: searchTerm, $options: 'i' }  // 'i' pour ignorer la casse
        });

        // Si des posts sont trouvés, on les renvoie, sinon on renvoie un message d'absence
        if (posts.length === 0) {
            return res.status(404).json({ message: "Aucun post trouvé pour ce terme" });
        }

        res.status(200).json({ posts });
    } catch (err) {
        console.error("Erreur lors de la recherche des posts :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { searchPosts };
