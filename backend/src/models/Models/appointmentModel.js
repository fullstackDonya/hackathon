const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;