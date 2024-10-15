const mongoose = require('mongoose');
const Person = require('./person');

const hospitalStaffSchema = new mongoose.Schema({
    staffID: { type: String, required: true, unique: true },
    staffRole: { type: String, required: true },  // Renamed from 'role' to 'staffRole' Discriminator key is 'role'
    department: { type: String, required: true }
});

// Methods specific to Hospital Staff
hospitalStaffSchema.methods.accessPatientRecords = function (patientID) {
    return `Accessing records for patient ${patientID}`;
};

hospitalStaffSchema.methods.updatePatientInfo = async function (patientID, updateData) {
    // Logic for updating patient information
    return `Updated information for patient ${patientID}`;
};

const HospitalStaff = Person.discriminator('HospitalStaff', hospitalStaffSchema);
module.exports = HospitalStaff;
