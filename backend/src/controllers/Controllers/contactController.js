const Contact = require('../Models/contactModel');

// Create a new contact
const createContact = async (req, res) => {
    try {
        const newContact = await Contact.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                contact: newContact
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get all contacts
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({
            status: 'success',
            results: contacts.length,
            data: {
                contacts
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get a single contact
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                status: 'fail',
                message: 'No contact found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                contact
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update a contact
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!contact) {
            return res.status(404).json({
                status: 'fail',
                message: 'No contact found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                contact
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete a contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({
                status: 'fail',
                message: 'No contact found with that ID'
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

module.exports = {
    createContact,
    getAllContacts,
    getContact,
    updateContact,
    deleteContact
};