const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
  },
}, { timestamps: true }); 

// Exporter le modèle
module.exports = mongoose.model("User", userSchema);