require("dotenv").config(); // Charger les variables d'environnement
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { setupWebSocket } = require("./websocket");
const http = require("http");
// Import des routes
const routes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 8083;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("dev")); // Logger les requêtes

// Connexion à MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Cannot connect to MongoDB:", err);
    process.exit(1);
  });

app.use("/", routes);

// Créer un serveur HTTP
const server = http.createServer(app);

// Configurer le WebSocket avec le serveur HTTP
setupWebSocket(server);

app.use('/Models/uploads', express.static('models/uploads'));  // Pour servir les fichiers statiques

// Démarrer le serveur HTTP
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});