const express = require("express");

const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();
const {
  Register,
  Login,
  updateUser,
  deleteUsers,
  deleteUser,
  getUsers,
  getUser,
  Logout,
  getConnectedUsers
} = require("../Controllers/userController");

const {
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  sendComment,
  getCommentsByPostId
} = require("../controllers/commentController");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../Controllers/postController");

const multer = require('multer');
const fs = require("fs");
const path = require("path");

const uploadDirectory = path.join(__dirname, "../Models", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }); 
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  }
});

const upload = multer({ storage });

// Routes utilisateur
router.post("/register", Register);
router.post("/login", Login);
router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete", authMiddleware, deleteUsers);
router.delete("/delete/:id", authMiddleware, deleteUser);
router.get("/users", getUsers);
router.get("/user/:id", authMiddleware, getUser);
router.get("/logout", authMiddleware, Logout);
router.get("/connected", authMiddleware, getConnectedUsers);

// Routes posts
router.get("/posts", getAllPosts);
router.get("/post/:id", getPostById);
router.post("/post", upload.single("image"), authMiddleware, createPost);
router.put("/post/:id", authMiddleware, updatePost);
router.delete("/post/:id", authMiddleware, deletePost);

// Routes comments
router.get("/comment/:id", authMiddleware, getCommentById);
router.post("/comment", authMiddleware, createComment);
router.put("/comment/:id", authMiddleware, updateComment);
router.delete("/comment/:id", authMiddleware, deleteComment);
router.post("/send", authMiddleware, sendComment);
router.get('/comments/:postId', getCommentsByPostId);

module.exports = router;