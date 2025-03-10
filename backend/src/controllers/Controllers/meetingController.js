const Meeting = require("../Models/meetingModel");
const { v4: uuidv4 } = require("uuid");

const createMeeting = async (req, res) => {
  try {
    const hostId = req.user.id;

    const meeting = new Meeting({
      title: req.body.title,
      host: hostId,
      participants: req.body.participants || [], // Optionnel : liste des participants
      meetingId: uuidv4(), // Génération d'un ID unique
    });

    await meeting.save();
    res.status(201).send(meeting);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    const meetings = await Meeting.find(filter)
      .populate("host", "username email")
      .populate("participants", "username email");

    res.status(200).send(meetings);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) {
      return res.status(404).send({ error: "Réunion introuvable" });
    }
    res.status(200).send(meeting);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("host", "username email")
      .populate("participants", "username email");

    if (!meeting) {
      return res.status(404).send({ error: "Réunion introuvable" });
    }
    res.status(200).send(meeting);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getMeetingsByUserId = async (req, res) => {
  try {
    const meetings = await Meeting.find({ host: req.params.userId })
      .populate("host", "username email")
      .populate("participants", "username email");

    if (meetings.length === 0) {
      return res.status(404).send({ error: "Aucune réunion trouvée pour cet utilisateur" });
    }
    res.status(200).send(meetings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).send({ error: "Réunion introuvable" });
    }
    res.status(200).send({ message: "Réunion supprimée avec succès" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  updateMeeting,
  getMeetingsByUserId,
  deleteMeeting,
  getMeetingById,
};
