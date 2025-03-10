const Appointment = require('../Models/appointmentModel');

// Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: {
                appointments
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const newAppointment = await Appointment.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                appointment: newAppointment
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get a single appointment
const getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                status: 'fail',
                message: 'No appointment found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                appointment
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update an appointment
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!appointment) {
            return res.status(404).json({
                status: 'fail',
                message: 'No appointment found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                appointment
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                status: 'fail',
                message: 'No appointment found with that ID'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get appointments for the logged-in user
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id; 
        const appointments = await Appointment.find({ user: userId });
        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: {
                appointments
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports = {
    getAllAppointments,
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getUserAppointments 
};