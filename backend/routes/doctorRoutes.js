// Doctor-related API routes
const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');

// Get all doctors method
//route to get all doctors from db
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving doctors', error: err.message });
    }
});

// Get a doctor by ID
//route to fetch a specific doctor
router.get('/:doctorID', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving doctor', error: err.message });
    }
});

// Create a new doctor
//route to create a new doctor
router.post('/', async (req, res) => {
    try {
        const { doctorID, name, dob, specialization, contactInfo, email, address } = req.body;

        // Check if doctor with the given ID already exists
        if (await Doctor.findOne({ doctorID })) {
            return res.status(400).json({ message: 'Doctor with this ID already exists' });
        }

        const newDoctor = new Doctor({
            doctorID,
            name,
            dob,
            specialization,
            contactInfo,
            email,
            address
        });

        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(500).json({ message: 'Error creating doctor', error: err.message });
    }
});

// Update a doctor
//route to update doctor details
router.put('/:doctorID', async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        Object.assign(doctor, req.body);
        await doctor.save();
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: 'Error updating doctor', error: err.message });
    }
});

// Delete a doctor
//route to delete a specific doctor
router.delete('/:doctorID', async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndDelete({ doctorID: req.params.doctorID });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting doctor', error: err.message });
    }
});

module.exports = router;
