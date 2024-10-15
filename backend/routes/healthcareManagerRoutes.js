const express = require('express');
const router = express.Router();
const HealthcareManager = require('../models/healthcareManager');

// Get all healthcare managers
router.get('/', async (req, res) => {
    try {
        const managers = await HealthcareManager.find();
        res.json(managers);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving healthcare managers', error: err.message });
    }
});

// Get a healthcare manager by ID
router.get('/:managerID', async (req, res) => {
    try {
        const manager = await HealthcareManager.findOne({ managerID: req.params.managerID });
        if (!manager) {
            return res.status(404).json({ message: 'Healthcare manager not found' });
        }
        res.json(manager);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving healthcare manager', error: err.message });
    }
});

// Create a new healthcare manager
router.post('/', async (req, res) => {
    try {
        const { managerID, name, dob, department, contactInfo, email, address } = req.body;

        const newManager = new HealthcareManager({
            managerID,
            name,
            dob,
            department,
            contactInfo,
            email,
            address
        });

        await newManager.save(); // Save the new healthcare manager instance
        res.status(201).json(newManager);
    } catch (err) {
        res.status(500).json({ message: 'Error creating healthcare manager', error: err.message });
    }
});

// Update a healthcare manager
router.put('/:managerID', async (req, res) => {
    try {
        const manager = await HealthcareManager.findOne({ managerID: req.params.managerID });
        if (!manager) {
            return res.status(404).json({ message: 'Healthcare manager not found' });
        }

        // Update fields
        Object.assign(manager, req.body); // Update the healthcare manager with request body data
        await manager.save(); // Save the updated instance
        res.json(manager);
    } catch (err) {
        res.status(500).json({ message: 'Error updating healthcare manager', error: err.message });
    }
});

// Delete a healthcare manager
router.delete('/:managerID', async (req, res) => {
    try {
        const manager = await HealthcareManager.findOneAndDelete({ managerID: req.params.managerID });
        if (!manager) {
            return res.status(404).json({ message: 'Healthcare manager not found' });
        }
        res.json({ message: 'Healthcare manager deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting healthcare manager', error: err.message });
    }
});

module.exports = router;
