// tests/scheduleAppointment.test.js
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const Appointment = require("../models/Appointment");

require("dotenv").config();

const appointmentData = {
    appointmentID: "test-appointment-id",
    appointmentDate: "2024-10-15",
    patientID: "test-patient-id",
    doctorID: "test-doctor-id",
    service: "Consultation",
    status: "Scheduled",
};

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

// Cleanup function to remove test appointments
const cleanupAppointments = async () => {
    await Appointment.deleteMany({ appointmentID: appointmentData.appointmentID });
};

// Test suite for appointment API
describe("Appointment API", () => {
    describe("POST /api/appointments", () => {
        afterAll(async () => {
            await cleanupAppointments();
        });

        it("should create a new appointment", async () => {
            const res = await request(app)
                .post("/api/appointments/")
                .send(appointmentData);
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Appointment created successfully!"); // This should now work
            expect(res.body.appointment.appointmentID).toBe(appointmentData.appointmentID); // Optionally check created appointment
        });

        it("should return an error for missing required fields", async () => {
            const res = await request(app)
                .post("/api/appointments/")
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Missing required fields");
        });
    });

    describe("GET /api/appointments", () => {
        beforeAll(async () => {
            // Insert a test appointment before the test runs
            const appointment = new Appointment(appointmentData);
            await appointment.save();
        });

        afterAll(async () => {
            await cleanupAppointments(); // Cleanup after tests
        });

        it("should retrieve all appointments", async () => {
            const res = await request(app).get("/api/appointments/");
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0); // Ensure you have appointments in the database
        });
    });
    // Get by ID tests
    describe("GET /api/appointments/:appointmentID", () => {
        let createdAppointment;

        beforeAll(async () => {
            createdAppointment = new Appointment(appointmentData);
            await createdAppointment.save();
        });

        afterAll(async () => {
            await cleanupAppointments(); // Cleanup after tests
        });

        it("should retrieve an appointment by ID", async () => {
            const res = await request(app).get(`/api/appointments/${createdAppointment.appointmentID}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.appointmentID).toBe(createdAppointment.appointmentID);
            expect(res.body.service).toBe(createdAppointment.service);
        });

        it("should return an error for a non-existent appointment ID", async () => {
            const res = await request(app).get("/api/appointments/non-existent-id");
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Appointment not found");
        });
    });

    // Delete tests
    describe("DELETE /api/appointments/:appointmentID", () => {
        let appointmentToDelete;

        beforeAll(async () => {
            appointmentToDelete = new Appointment(appointmentData);
            await appointmentToDelete.save();
        });

        afterAll(async () => {
            await cleanupAppointments(); // Cleanup after tests
        });

        it("should delete an appointment by ID", async () => {
            const res = await request(app).delete(`/api/appointments/${appointmentToDelete.appointmentID}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Appointment canceled successfully");
        });

        it("should return an error for a non-existent appointment ID", async () => {
            const res = await request(app).delete("/api/appointments/non-existent-id");
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Appointment not found");
        });
    });
});
 