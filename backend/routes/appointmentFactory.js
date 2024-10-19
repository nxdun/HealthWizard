const Appointment = require('../models/Appointment');

class AppointmentFactory {
    static createAppointment(data) {
        return new Appointment(data);
    }
}

module.exports = AppointmentFactory;
