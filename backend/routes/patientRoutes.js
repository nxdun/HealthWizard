const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving patients', error: err.message });
    }
});

// Get a patient by ID
router.get('/:patientID', async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientID: req.params.patientID });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving patient', error: err.message });
    }
});

// Create a new patient
router.post('/', async (req, res) => {
    try {
        const { patientID, name, dob, contactInfo, email, address, medicalHistory } = req.body;

        // Check if a patient with the given ID already exists
        if (await Patient.findOne({ patientID })) {
            return res.status(400).json({ message: 'Patient with this ID already exists' });
        }

        const newPatient = new Patient({
            patientID,
            name,
            dob,
            contactInfo,
            email,
            address,
            medicalHistory
        });

        await newPatient.createAccount();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ message: 'Error creating patient', error: err.message });
    }
});

// Update a patient
router.put('/:patientID', async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientID: req.params.patientID });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await patient.updateAccount(req.body);
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error updating patient', error: err.message });
    }
});

// Delete a patient
router.delete('/:patientID', async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({ patientID: req.params.patientID });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting patient', error: err.message });
    }
});

module.exports = router;
