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
  deletePost,
  getPostsByUserId
} = require("../controllers/postController");

const {
  like,
  unlike,
  getLikes,
  getCommentLikes

} = require('../controllers/likeController');

const { addSignet, removeSignet ,getUserSignets } = require('../controllers/signetController');
const { 
  retweetPost,
  unretweetPost,
  getRetweets
} = require('../controllers/retweetController');

const { followUser, unfollowUser, getFollowing, getFollowers } = require('../controllers/SubscriptionController');
const { searchPosts } = require('../controllers/searchController');
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  createNotification 
} = require('../controllers/notificationController');

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
router.get("/posts", authMiddleware, getAllPosts);
router.get("/post/:id", getPostById);
router.post("/post", upload.single("image"), authMiddleware, createPost);
router.put("/post/:id", authMiddleware, updatePost);
router.delete("/post/:id", authMiddleware, deletePost);
router.get("/posts/user/:userId", getPostsByUserId);

// Routes Comments
router.get("/comment/:id", authMiddleware, getCommentById);
router.post("/comment",  createComment);
router.put("/comment/:id", authMiddleware, updateComment);
router.delete("/comment/:id", authMiddleware, deleteComment);
router.post("comment/send", authMiddleware, sendComment);
router.get('/comments/:postId', getCommentsByPostId);

// Routes Like
router.post('/post/like', authMiddleware, like);
router.post('/post/unlike', authMiddleware, unlike);
router.get('/post/:postId/likes', getLikes);
router.post('/comment/like', authMiddleware, like);
router.post('/comment/unlike', authMiddleware, unlike);
router.get('/comment/:commentId/likes', getCommentLikes);

// Routes Signet
router.post('/signet', authMiddleware, addSignet);
router.delete('/signet', authMiddleware, removeSignet);
router.get('/signets', authMiddleware, getUserSignets);

// Routes ReTweet
router.post('/retweet', authMiddleware, retweetPost);
router.delete('/retweet', authMiddleware, unretweetPost);
router.get('/post/:postId/retweets', getRetweets);

//Routes Sub
router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.get('/following', authMiddleware, getFollowing);
router.get('/followers', authMiddleware, getFollowers);

//Routes SearchBar
router.get('/search', searchPosts);

//Routes Notifications 

// Routes Notifications 
router.post('/notifications', authMiddleware, createNotification);
router.get('/notifications', authMiddleware, getNotifications);
router.put('/notifications/:id/read', authMiddleware, markAsRead);
router.put('/notifications/read-all', authMiddleware, markAllAsRead);

module.exports = router;