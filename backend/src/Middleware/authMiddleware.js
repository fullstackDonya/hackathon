const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    
    
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
        }

        const token = authHeader.split(" ")[1]; // Récupérer le token après "Bearer"
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajouter l'utilisateur à la requête
        req.user = decoded;  
        console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide." });
    }
};

module.exports = authMiddleware;
