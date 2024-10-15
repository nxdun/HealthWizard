const mongoose = require('mongoose');
const Person = require('./person');

const patientSchema = new mongoose.Schema({
    patientID: { type: String, required: true, unique: true },
    medicalHistory: { type: [String], default: [] },
    accountStatus: { type: String, default: 'Active' },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

// Methods specific to the Patient model
patientSchema.methods.createAccount = async function () {
    try {
        return await this.save();
    } catch (err) {
        throw new Error('Error creating account: ' + err.message);
    }
};

patientSchema.methods.updateAccount = async function (updateData) {
    try {
        Object.assign(this, updateData);
        return await this.save();
    } catch (err) {
        throw new Error('Error updating account: ' + err.message);
    }
};

patientSchema.methods.viewMedicalRecords = function () {
    return this.medicalHistory;
};

const Patient = Person.discriminator('Patient', patientSchema);
module.exports = Patient;
