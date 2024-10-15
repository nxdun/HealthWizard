// models/appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentID: { type: String, required: true, unique: true },
    appointmentDate: { type: Date, required: true },
    patientID: { type: String, required: true },
    doctorID: { type: String, required: true },
    service: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Canceled', 'Rescheduled', 'Pending', 'NoShow'], 
        default: 'Pending' // Default status set to Pending
    }
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

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
