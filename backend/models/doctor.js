// Doctor model inheriting from Person
const mongoose = require('mongoose');
const Person = require('./person');


//doctor schema
const doctorSchema = new mongoose.Schema({
    isDoctor: { type: Boolean, default: false },
    doctorID: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    experience: {
        type: Number,
        required: true,
      },
    fees: { type: String, required: true },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
});

// Methods specific to Doctor
//doctor add diagnosis method
doctorSchema.methods.addDiagnosis = function (patientID, diagnosis) {
    return `Diagnosis for patient ${patientID}: ${diagnosis}`;
};

//doctor schedule update method
doctorSchema.methods.updateSchedule = async function (appointment) {
    this.appointments.push(appointment);
    return await this.save();
};

//generate random doctor ID
doctorSchema.methods.generateRandomID = function (prefix) {
    return `${prefix}${Math.floor(Math.random() * 10000)}`;
};

const Doctor = Person.discriminator('Doctor', doctorSchema);
module.exports = Doctor;
