// models/appointment.js
const mongoose = require('mongoose');
const Doctor = require('./doctor'); // Make sure to import your Doctor model
const Patient = require('./patient'); // Make sure to import your Patient model

const appointmentSchema = new mongoose.Schema({
    appointmentID: { type: String, required: true, unique: true },
    appointmentDate: { type: Date, required: true },
    patientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Change here
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Change here
    service: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Canceled', 'Rescheduled', 'Pending', 'NoShow'], 
        default: 'Pending' // Default status set to Pending
    }
},
{
  timestamps: true,
}
);

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
