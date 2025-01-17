// models/appointment.js
const mongoose = require('mongoose');
const Doctor = require('./doctor'); // Make sure to import your Doctor model
const Patient = require('./patient'); // Make sure to import your Patient model

const appointmentSchema = new mongoose.Schema({
    appointmentID: { type: String, required: true, unique: true },
    appointmentDate: { type: Date, required: true },
    patientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    service: { type: String, required: true },
    price: { type: Number, default: 0 },
    location: { type: String },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Canceled', 'Rescheduled', 'Pending', 'NoShow', 'paid'], 
        default: 'Pending' // Default status set to Pending
    }
}, {
    timestamps: true,
});

// Instance methods
appointmentSchema.methods.scheduleAppointment = function (date, time) {
    this.appointmentDate = new Date(`${date}T${time}`);
    return this.save();
};

appointmentSchema.methods.rescheduleAppointment = function (newDate, newTime) {
    this.appointmentDate = new Date(`${newDate}T${newTime}`);
    return this.save();
};

appointmentSchema.methods.cancelAppointment = function () {
    this.status = 'Canceled';
    return this.save();
};

// Prevent OverwriteModelError
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
