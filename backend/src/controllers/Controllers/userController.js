const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectedUsers = {};
dotenv.config();

const Register = async (req, res) => {
  try {
    console.log("body", req.body);
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res
        .status(400)
        .send("Merci de remplir les champs Username, Password & Email");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashedPassword,
      email: req.body.email,
      age: req.body.age || null, 
      role: req.body.role || null,
    });

    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const Login = async (req, res) => {
  try {
    console.log("Données reçues :", req.body);

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log("Utilisateur trouvé :", user); // Vérifier que user est bien récupéré
    console.log("ID utilisateur envoyé :", user.id);

    res.status(200).json({ 
      message: "Connecté", 
      token,
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).send({ error: "Utilisateur introuvable" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).send({ error: "Utilisateur introuvable" });
    }
    res.status(200).send({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send({ error: "Utilisateur introuvable" });
    }

    res.status(200).send({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).send({ message: "Erreur serveur : " + error.message });
  }
};




const getUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.username) {
      filter.username = { $regex: req.query.username, $options: "i" };
    }

    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }

    const users = await User.find(filter).select("-password");
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id
    ).select("-password");
    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable" });
    }
    res.status(200).send(user);
  }
  catch (error) {
    res.status(500).send({ message: "Erreur serveur : " + error.message });
  }
};

const Logout = (req, res) => {
  try {
    // Retirer l'utilisateur de la liste des utilisateurs connectés
    if (req.user && req.user.id) {
      delete connectedUsers[req.user.id];
    }

    req.user = null; // Clear the user information from the request
    res.status(200).send({ message: "Déconnecté avec succès" });
  } catch (error) {
    res.status(500).send({ message: "Erreur serveur : " + error.message });
  }
};

const getConnectedUsers = async (req, res) => {
  try {
    // Convertir l'objet connectedUsers en tableau
    const users = Object.values(connectedUsers).map(user => ({
      id: user._id,
      username: user.username,
      email: user.email
    }));

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = { Register, Login, updateUser, deleteUser, getUsers, getUser, deleteUsers, Logout, getConnectedUsers };
