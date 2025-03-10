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
  createMeeting,
  getMeetings,
  updateMeeting,
  deleteMeeting,
  getMeetingById,
  getMeetingsByUserId, 
} = require("../Controllers/meetingController");

const {
  getAllAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getUserAppointments 
} = require("../Controllers/appointmentController");

const {
  createConversation,
  getConversationById,
  getUserConversations,
  deleteConversation,
} = require("../Controllers/conversationController");

const {
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  sendMessage,
  getMessagesByConversationId

} = require("../Controllers/messageController");

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require("../Controllers/postController");

const {
  createContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact
} = require("../Controllers/contactController");

const {
  submitDiagnostic
} = require("../Controllers/DiagnosticController");


const {
  getQuestions,
  getQuestionsByCategory,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require("../Controllers/questionController");

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

// Routes diagnostics
// Route pour soumettre les réponses
router.post('/submit', submitDiagnostic);

// Routes questions 
router.get('/questions', getQuestions);
router.get('/questions/:category', getQuestionsByCategory); // Nouvelle route pour récupérer les questions par catégorie
router.get('/question/:id', getQuestionById);
router.post('/question', authMiddleware, createQuestion);
router.put('/question/:id', authMiddleware, updateQuestion);
router.delete('/question/:id', authMiddleware, deleteQuestion);


// Routes contacts
router.post("/contact", createContact);
router.get("/contacts", authMiddleware, getAllContacts);
router.get("/contact/:id", getContact);
router.put("/contact/:id", authMiddleware, updateContact);
router.delete("/contact/:id", authMiddleware, deleteContact);

// Routes posts
router.get("/posts", getAllPosts);
router.get("/post/:id", getPostById);
router.post("/post",  upload.single("image"), authMiddleware, createPost);
router.put("/post/:id",authMiddleware,  updatePost);
router.delete("/post/:id",authMiddleware, deletePost);

// Routes réunions (meetings)
router.get("/meeting/user/:userId", authMiddleware, getMeetingsByUserId); 
router.post("/meeting", authMiddleware, createMeeting);
router.get("/meetings", authMiddleware, getMeetings); 
router.put("/meeting/:id", authMiddleware, updateMeeting); 
router.get("/meeting/:id", authMiddleware, getMeetingById); 
router.delete("/meeting/:id", authMiddleware, deleteMeeting); 

// Routes réunions (appoinments)
router.get("/appointments", authMiddleware, getAllAppointments);
router.post("/appointment", authMiddleware, createAppointment);
router.get("/appointment/:id", authMiddleware, getAppointment);
router.put("/appointment/:id", authMiddleware, updateAppointment);
router.delete("/appointment/:id", authMiddleware, deleteAppointment);
router.get("/appointments/user", authMiddleware, getUserAppointments);

// Routes conversations
router.post("/conversations", authMiddleware, createConversation);
router.get("/conversations", authMiddleware, getUserConversations);
router.get("/conversations/:id", authMiddleware, getConversationById);
router.delete("/conversations/:id", authMiddleware, deleteConversation);


// Routes messages
router.get("/message/:id", authMiddleware, getMessageById);
router.post("/message", authMiddleware, createMessage);
router.put("/message/:id", authMiddleware, updateMessage);
router.delete("/message/:id", authMiddleware, deleteMessage);
router.post("/send", authMiddleware, sendMessage);
router.get('/messages/:conversationId', getMessagesByConversationId);

module.exports = router;
