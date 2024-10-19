const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');
const Appointment = require('../models/Appointment');

// Sample appointment data for testing
const appointmentData = {
    appointmentID: "test-appointment-id-123",
    appointmentDate: "2024-10-24T02:30:00.000+00:00",
    patientID: new mongoose.Types.ObjectId(),
    doctorID: new mongoose.Types.ObjectId(),
    service: "Neurology",
    price: 23,
    location: "Private",
    status: "Pending",
};

// Ensure the DB connection is active only if not already connected
beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.TEST_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
});

// Cleanup test appointments after tests
afterAll(async () => {
    await Appointment.deleteMany({ appointmentID: appointmentData.appointmentID });
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
});

describe('POST /api/appointments', () => {
    // Clean up after each test
    afterEach(async () => {
        await Appointment.deleteMany({ appointmentID: appointmentData.appointmentID });
    });

    it('should create a new appointment successfully', async () => {
        const res = await request(app)
            .post('/api/appointments')
            .send(appointmentData);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Appointment created successfully!");
        expect(res.body.appointment.appointmentID).toBe(appointmentData.appointmentID);
        expect(res.body.appointment.service).toBe(appointmentData.service);
    });

    it('should return a 400 error for missing required fields', async () => {
        const res = await request(app)
            .post('/api/appointments')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Missing required fields.');
    });

    it('should return a 500 error for database issues', async () => {
        jest.spyOn(Appointment.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Database Error');
        });

        const res = await request(app)
            .post('/api/appointments')
            .send(appointmentData);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('Error creating appointment.');
        expect(res.body.error).toBe('Database Error');
    });
});

describe('GET /api/appointments/getallappointments', () => {
    beforeEach(async () => {
        // Create a test appointment before each test
        await Appointment.create(appointmentData);
    });

    afterEach(async () => {
        // Clean up appointments after each test
        await Appointment.deleteMany({});
    });

    it('should retrieve all appointments successfully', async () => {
        const res = await request(app).get('/api/appointments/getallappointments');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1); // Expecting one appointment
    });

    it('should return an empty array if no appointments exist', async () => {
        await Appointment.deleteMany({}); // Remove appointments to test empty state

        const res = await request(app).get('/api/appointments/getallappointments');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]); // Expecting an empty array
    });

    it('should return a 500 error for database issues', async () => {
        jest.spyOn(Appointment, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get('/api/appointments/getallappointments');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Error retrieving appointments.');
    });
});




