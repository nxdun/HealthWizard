const express = require('express');
const router = express.Router();
const MedicalRecordFactory = require('../models/medicalRecordFactory');
const { MedicalRecord } = require('../models/medicalRecord');

// Route to create a Medical Record
router.post('/create', async (req, res) => {
  const { type, recordData } = req.body;
  const factory = new MedicalRecordFactory();
  
  try {
    const medicalRecord = factory.createRecord(type, recordData);
    await medicalRecord.save();
    res.status(201).send(`${type} medical record created successfully.`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to get all medical records for a specific patient by patientID
router.get('/:patientID', async (req, res) => {
  const { patientID } = req.params;
  
  try {
    const records = await MedicalRecord.find({ patientID });
    if (records.length === 0) {
      return res.status(404).send('No medical records found for this patient.');
    }
    res.status(200).json(records);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to update a medical record by recordID
router.put('/:recordID', async (req, res) => {
  const { recordID } = req.params;
  const updateData = req.body;
  
  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(recordID, updateData, { new: true });
    if (!updatedRecord) {
      return res.status(404).send('Medical record not found.');
    }
    res.status(200).send('Medical record updated successfully.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to delete a medical record by recordID
router.delete('/:recordID', async (req, res) => {
  const { recordID } = req.params;
  
  try {
    const deletedRecord = await MedicalRecord.findByIdAndDelete(recordID);
    if (!deletedRecord) {
      return res.status(404).send('Medical record not found.');
    }
    res.status(200).send('Medical record deleted successfully.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;