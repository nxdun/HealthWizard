// routes/digitalHealthCardRoutes.js
const express = require('express');
const router = express.Router();
const DigitalHealthCard = require('../models/digitalHealthCard');
const Patient = require('../models/patient'); // To validate patient existence

// Create a new digital health card for a patient
router.post('/', async (req, res) => {
    try {
        const { patientID, qrCode, barcode } = req.body;

        // Validate the patient ID using the model's method
        const patient = await DigitalHealthCard.validatePatientID(patientID);
        if (!patient) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }

        // Check if a digital health card already exists for this patient
        const existingCard = await DigitalHealthCard.findOne({ patient: patientID });
        if (existingCard) {
            return res.status(400).json({ message: 'Patient already has a Digital Health Card' });
        }

        // Create the digital health card
        const cardID = `DHC-${Date.now()}`; // Example card ID generation
        const newCard = new DigitalHealthCard({ cardID, qrCode, barcode, patient: patientID });
        await newCard.createCard();

        res.status(201).json(newCard);
    } catch (err) {
        res.status(500).json({ message: 'Error creating digital health card', error: err.message });
    }
});

// Get a digital health card by patient ID
router.get('/:patientID', async (req, res) => {
    try {
        const card = await DigitalHealthCard.findOne({ patient: req.params.patientID });
        if (!card) {
            return res.status(404).json({ message: 'Digital Health Card not found' });
        }
        res.json(card);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving digital health card', error: err.message });
    }
});

// Revoke a digital health card
router.put('/revoke/:patientID', async (req, res) => {
    try {
        const card = await DigitalHealthCard.findOne({ patient: req.params.patientID });
        if (!card) {
            return res.status(404).json({ message: 'Digital Health Card not found' });
        }

        await card.revokeCard();
        res.json({ message: 'Digital Health Card revoked successfully', card });
    } catch (err) {
        res.status(500).json({ message: 'Error revoking digital health card', error: err.message });
    }
});

module.exports = router;
