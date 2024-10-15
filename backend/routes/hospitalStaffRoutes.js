const express = require('express');
const router = express.Router();
const HospitalStaff = require('../models/hospitalStaff');

// Get all hospital staff
router.get('/', async (req, res) => {
    try {
        const staff = await HospitalStaff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving staff', error: err.message });
    }
});

// Get a staff member by ID
router.get('/:staffID', async (req, res) => {
    try {
        const staff = await HospitalStaff.findOne({ staffID: req.params.staffID });
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving staff member', error: err.message });
    }
});

// Create a new hospital staff member
router.post('/', async (req, res) => {
    try {
        const { staffID, name, dob, staffRole, department, contactInfo, email, address } = req.body;

        // Check if staff member with the given ID already exists
        if (await HospitalStaff.findOne({ staffID })) {
            return res.status(400).json({ message: 'Staff member with this ID already exists' });
        }

        const newStaff = new HospitalStaff({
            staffID,
            name,
            dob,
            staffRole,
            department,
            contactInfo,
            email,
            address
        });

        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(500).json({ message: 'Error creating staff member', error: err.message });
    }
});

// Update a hospital staff member
router.put('/:staffID', async (req, res) => {
    try {
        const staff = await HospitalStaff.findOne({ staffID: req.params.staffID });
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        Object.assign(staff, req.body);
        await staff.save();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Error updating staff member', error: err.message });
    }
});

// Delete a hospital staff member
router.delete('/:staffID', async (req, res) => {
    try {
        const staff = await HospitalStaff.findOneAndDelete({ staffID: req.params.staffID });
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json({ message: 'Staff member deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting staff member', error: err.message });
    }
});

module.exports = router;
