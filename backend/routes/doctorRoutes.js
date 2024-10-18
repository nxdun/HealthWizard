// Doctor-related API routes
const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');
const Person = require('../models/person');
const Patient = require('../models/patient');
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

router.get('/all', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isDoctor: true });
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
        const { patientID, specialization, experience, fees } = req.body;

        // Get patient data
        const patient = await Person.findOne({ _id: patientID });
        if (!patient) {
            return res.status(404).json({ message: 'Unauthorized' });
        }

        // Check if a doctor with the same email already exists
        const { email } = patient;
        if (await Doctor.findOne({ email })) {
            return res.status(400).json({ message: 'Doctor with this email already exists' });
        }

        const { firstname, lastname, dob, address, password, gender, mobile, digitalCard, status, pic } = patient;
        const doctorID = `DOC${Math.floor(Math.random() * 10000)}`;

        // Remove the corresponding person data
        await Person.findOneAndDelete({ email: email });


        const newDoctor = new Doctor({
            doctorID,
            firstname,
            lastname,
            dob,
            specialization,
            experience,
            mobile,
            email,
            address,
            password,
            gender,
            digitalCard,
            status,
            pic,
            fees,
            isDoctor: false // Set to false until the application is approved
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Application Submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating doctor', error: err.message });
    }
});


// Approve a doctor
// Route to approve a doctor application
router.put('/approve/:doctorID', async (req, res) => {
    try {
        // Find the doctor by doctorID
        const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Set isDoctor to true
        doctor.isDoctor = true;
        await doctor.save();

        res.json({ message: 'Doctor approved successfully and person data removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error approving doctor', error: err.message });
    }
});

//reject a doctor
//route to reject a doctor application
router.put('/reject/:doctorID', async (req, res) => {
    try {
        // Find the doctor by doctorID
        const doctor = await Doctor.findOne({ doctorID: req.params.doctorID });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        //recreate the person data
        const { firstname, lastname, dob, address, password, gender, mobile, digitalCard, status, pic,email } = doctor;
        const patientID = `PAT${Math.floor(Math.random() * 10000)}`;

        const newPerson = new Patient({
            patientID,
            firstname,
            lastname,
            dob,
            mobile,
            email,
            address,
            password,
            gender,
            digitalCard,
            status,
            pic
        });

        // Remove the doctor data
        await Doctor.findOneAndDelete({ doctorID: req.params.doctorID });

        await newPerson.save();

        res.json({ message: 'Doctor rejected User is Now Patient' });

        
    } catch (err) {
        res.status(500).json({ message: 'Error rejecting doctor', error: err.message });
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
