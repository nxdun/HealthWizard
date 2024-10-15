// tests/doctor.test.js

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const Doctor = require("../models/doctor");

require("dotenv").config();

// Define the test doctor data with a unique doctorID
const testDoctor = {
    doctorID: "D001", // Use a specific ID for testing
    name: "Dr. John Doe",
    dob: "1980-01-15",
    specialization: "Cardiology",
    contactInfo: "555-1234",
    email: "john.doe@example.com",
    address: "123 Heartbeat Lane"
};

// Define the updated data
const updatedDoctor = {
    name: "Dr. John Smith",
    contactInfo: "555-4321"
};

// Cleanup function to remove test doctors
const cleanupDoctors = async () => {
    await Doctor.deleteMany({ doctorID: testDoctor.doctorID });
};

beforeAll(async () => {
    // Connect to the MongoDB test database
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await cleanupDoctors();
    await mongoose.connection.close();
});

describe("Doctor API", () => {

    // Test suite for POST /api/doctors
    describe("POST /api/doctors", () => {
        afterEach(async () => {
            await cleanupDoctors();
        });

        it("should create a new doctor", async () => {
            const res = await request(app)
                .post("/api/doctors")
                .send(testDoctor);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("doctorID", testDoctor.doctorID);
            expect(res.body).toHaveProperty("name", testDoctor.name);
        });

        it("should return an error for duplicate doctorID", async () => {
            await request(app)
                .post("/api/doctors")
                .send(testDoctor); // Create first entry

            const res = await request(app)
                .post("/api/doctors")
                .send(testDoctor); // Attempt to create a duplicate
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Doctor with this ID already exists");
        });

        it("should return an error for missing required fields", async () => {
            const res = await request(app)
                .post("/api/doctors")
                .send({}); // Sending empty body
            expect(res.statusCode).toEqual(500); // Adjust based on your error handling
            expect(res.body).toHaveProperty("message", "Error creating doctor");
        });
    });

    // Test suite for GET /api/doctors
    describe("GET /api/doctors", () => {
        beforeAll(async () => {
            // Insert a test doctor before running GET tests
            await Doctor.create(testDoctor);
        });

        afterAll(async () => {
            await cleanupDoctors();
        });

        it("should get all doctors", async () => {
            const res = await request(app).get("/api/doctors");
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // Test suite for GET /api/doctors/:doctorID
    describe("GET /api/doctors/:doctorID", () => {
        beforeAll(async () => {
            await Doctor.create(testDoctor);
        });

        afterAll(async () => {
            await cleanupDoctors();
        });

        it("should get a doctor by ID", async () => {
            const res = await request(app).get(`/api/doctors/${testDoctor.doctorID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("doctorID", testDoctor.doctorID);
            expect(res.body).toHaveProperty("name", testDoctor.name);
        });

        it("should return 404 for a non-existent doctor ID", async () => {
            const res = await request(app).get("/api/doctors/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Doctor not found");
        });
    });

    // Test suite for PUT /api/doctors/:doctorID
    describe("PUT /api/doctors/:doctorID", () => {
        beforeEach(async () => {
            await Doctor.create(testDoctor);
        });

        afterEach(async () => {
            await cleanupDoctors();
        });

        it("should update an existing doctor", async () => {
            const res = await request(app)
                .put(`/api/doctors/${testDoctor.doctorID}`)
                .send(updatedDoctor);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("name", updatedDoctor.name);
            expect(res.body).toHaveProperty("contactInfo", updatedDoctor.contactInfo);
        });

        it("should return 404 when updating a non-existent doctor", async () => {
            const res = await request(app)
                .put("/api/doctors/non-existent-id")
                .send({ name: "No One" });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Doctor not found");
        });
    });

    // Test suite for DELETE /api/doctors/:doctorID
    describe("DELETE /api/doctors/:doctorID", () => {
        beforeEach(async () => {
            await Doctor.create(testDoctor);
        });

        afterEach(async () => {
            await cleanupDoctors();
        });

        it("should delete a doctor", async () => {
            const res = await request(app)
                .delete(`/api/doctors/${testDoctor.doctorID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("message", "Doctor deleted successfully");
        });

        it("should return 404 when deleting a non-existent doctor", async () => {
            const res = await request(app)
                .delete("/api/doctors/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Doctor not found");
        });
    });
});
