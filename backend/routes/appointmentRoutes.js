// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/doctor');
const Person = require('../models/person');
const Patient = require('../models/patient');

//add common validations for validateAppointment middleware
const validateAppointment = (req, res, next) => {
    const { appointmentID, appointmentDate, patientID, doctorID, service } = req.body;

    if (!appointmentID || !appointmentDate || !patientID || !doctorID || !service) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    next();
};


// Get all appointments with doctor and patient details
router.get('/getallappointments', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctorID', 'firstname lastname') // Fetch doctor details
            .populate('patientID', 'firstname lastname'); // Fetch patient details
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving appointments.', error: err.message });
    }
});

// Get appointments for a specific patient
router.get('/getPatientAppointments/:patientID', async (req, res) => {
    try {
        const { patientID } = req.params;
        const appointments = await Appointment.find({ patientID })
            .populate('doctorID', 'firstname lastname') // Populating doctor details
            .populate('patientID', 'firstname lastname'); // Populating patient details

        res.json(appointments);
    } catch (err) {
        console.error("Error retrieving appointments:", err);
        res.status(500).json({ message: 'Error retrieving appointments.', error: err.message });
    }
});

// Get all appointments
router.get('/getall', async (req, res) => {
    try {
        const appointments = await Appointment.find(); 
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving appointments.', error: err.message });
    }
});


// Get an appointment by ID
router.get('/:appointmentID',  async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ appointmentID: req.params.appointmentID });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving appointment.', error: err.message });
    }
});

// Create a new appointment
router.post('/',validateAppointment,async (req, res) => {
    try {
        const { appointmentID, appointmentDate, patientID, doctorID, service } = req.body;

        const newAppointment = new Appointment({
            appointmentID,
            appointmentDate,
            patientID,
            doctorID,
            service
        });

        await newAppointment.save();
        // Return success message along with the created appointment
        res.status(201).json({
            message: "Appointment created successfully!",
            appointment: newAppointment // Optionally include the created appointment
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating appointment.', error: err.message });
    }
});

// Update an appointment
router.put('/:appointmentID',validateAppointment,  async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ appointmentID: req.params.appointmentID });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        req.body.appointmentID = req.params.appointmentID;

        // Update the appointment with new data
        Object.assign(appointment, req.body);
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error updating appointment.', error: err.message });
    }
});

// Cancel an appointment
router.delete('/:appointmentID', async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({ appointmentID: req.params.appointmentID });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment canceled successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error canceling appointment', error: err.message });
    }
});

// Additional route to update status
router.patch('/s/:appointmentID', async (req, res) => {
    try {
        const { status } = req.body; // Expect status to be sent in request body
        const validStatuses = ['Scheduled', 'Completed', 'Canceled', 'Rescheduled', 'Pending', 'NoShow'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const appointment = await Appointment.findOne({ appointmentID: req.params.appointmentID });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        appointment.status = status; // Update the status
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error updating appointment status', error: err.message });
    }
});

module.exports = router;
