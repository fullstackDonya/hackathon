const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // L'hôte de la réunion
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liste des utilisateurs participant à la réunion
    },
  ],
  meetingId: {
    type: String,
    unique: true,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Indique si la réunion est en cours ou terminée
  },
  startedAt: {
    type: Date,
    default: Date.now, // Heure de début de la réunion
  },
  endedAt: {
    type: Date, // Heure de fin de la réunion (null si en cours)
  },
});

module.exports = mongoose.model("Meeting", meetingSchema);
