const mongoose = require('mongoose');
const Person = require('./person'); // Importing Person model

const healthcareManagerSchema = new mongoose.Schema({
    managerID: { type: String, required: true, unique: true }, // Unique manager ID
    department: { type: String, required: true },
    contactInfo: { type: String, required: true } // Inheriting contactInfo from Person
});

// Adding createAccount method for HealthcareManager
healthcareManagerSchema.methods.createAccount = async function () {
    try {
        return await this.save(); // Save the Healthcare Manager instance
    } catch (err) {
        throw new Error('Error creating account: ' + err.message);
    }
};

// Creating a discriminator for HealthcareManager
const HealthcareManager = Person.discriminator('HealthcareManager', healthcareManagerSchema);

module.exports = HealthcareManager;
