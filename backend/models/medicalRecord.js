// MedicalRecord model
const mongoose = require('mongoose');

// Base Schema for MedicalRecord (not directly instantiated)
const MedicalRecordSchema = new mongoose.Schema({
  patientID: { type: String, required: true },
  doctorID: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  dateOfRecord: { type: Date, default: Date.now },
}, { discriminatorKey: 'recordType', collection: 'medicalrecords' });

// Create base model for MedicalRecord
const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);

// GeneralMedicalRecord Schema
const GeneralMedicalRecordSchema = new mongoose.Schema({
  symptoms: { type: String, required: true },
});

// SurgeryMedicalRecord Schema
const SurgeryMedicalRecordSchema = new mongoose.Schema({
  surgeryType: { type: String, required: true },
  surgeonID: { type: String, required: true },
});

// PrescriptionMedicalRecord Schema
const PrescriptionMedicalRecordSchema = new mongoose.Schema({
  prescriptionDetails: { type: String, required: true },
});

// Use discriminators to create each type of MedicalRecord based on the base schema
const GeneralMedicalRecord = MedicalRecord.discriminator('General', GeneralMedicalRecordSchema);
const SurgeryMedicalRecord = MedicalRecord.discriminator('Surgery', SurgeryMedicalRecordSchema);
const PrescriptionMedicalRecord = MedicalRecord.discriminator('Prescription', PrescriptionMedicalRecordSchema);

// Export the base model and its discriminators
module.exports = {
  MedicalRecord,
  GeneralMedicalRecord,
  SurgeryMedicalRecord,
  PrescriptionMedicalRecord
};
