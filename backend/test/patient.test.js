// tests/patient.test.js

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const Patient = require("../models/patient");

require("dotenv").config();

// Define the test patient data with a unique patientID
const testPatient = {
    patientID: "P002", // Use a specific ID for testing
    name: "Super John Doe",
    dob: "1985-07-15",
    contactInfo: "555-1234",
    email: "john.doe@example.com",
    address: "123 Main St, Springfield",
    medicalHistory: [
        "Hypertension",
        "Diabetes"
    ],
    accountStatus: "Active"
};

// Define the updated data
const updatedPatient = {
    name: "Super John Smith",
    contactInfo: "555-9876"
};

// Cleanup function to remove test patients
const cleanupPatients = async () => {
    await Patient.deleteMany({ patientID: testPatient.patientID });
};

beforeAll(async () => {
    // Connect to the MongoDB test database
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await cleanupPatients();
    await mongoose.connection.close();
});

describe("Patient API", () => {

    // Test suite for POST /api/patients
    describe("POST /api/patients", () => {
        afterEach(async () => {
            await cleanupPatients();
        });

        it("should create a new patient", async () => {
            const res = await request(app)
                .post("/api/patients")
                .send(testPatient);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("patientID", testPatient.patientID);
            expect(res.body).toHaveProperty("name", testPatient.name);
        });

        it("should return an error for duplicate patientID", async () => {
            await request(app)
                .post("/api/patients")
                .send(testPatient); // Create first entry

            const res = await request(app)
                .post("/api/patients")
                .send(testPatient); // Attempt to create a duplicate
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Patient with this ID already exists");
        });

        it("should return an error for missing required fields", async () => {
            const res = await request(app)
                .post("/api/patients")
                .send({}); // Sending empty body
            expect(res.statusCode).toEqual(500); // Adjust based on your error handling
            expect(res.body).toHaveProperty("message", "Error creating patient");
        });
    });

    // Test suite for GET /api/patients
    describe("GET /api/patients", () => {
        beforeAll(async () => {
            // Insert a test patient before running GET tests
            await Patient.create(testPatient);
        });

        afterAll(async () => {
            await cleanupPatients();
        });

        it("should get all patients", async () => {
            const res = await request(app).get("/api/patients");
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // Test suite for GET /api/patients/:patientID
    describe("GET /api/patients/:patientID", () => {
        beforeAll(async () => {
            await Patient.create(testPatient);
        });

        afterAll(async () => {
            await cleanupPatients();
        });

        it("should get a patient by ID", async () => {
            const res = await request(app).get(`/api/patients/${testPatient.patientID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("patientID", testPatient.patientID);
            expect(res.body).toHaveProperty("name", testPatient.name);
        });

        it("should return 404 for a non-existent patient ID", async () => {
            const res = await request(app).get("/api/patients/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Patient not found");
        });
    });

    // Test suite for PUT /api/patients/:patientID
    describe("PUT /api/patients/:patientID", () => {
        beforeEach(async () => {
            await Patient.create(testPatient);
        });

        afterEach(async () => {
            await cleanupPatients();
        });

        it("should update an existing patient", async () => {
            const res = await request(app)
                .put(`/api/patients/${testPatient.patientID}`)
                .send(updatedPatient);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("name", updatedPatient.name);
            expect(res.body).toHaveProperty("contactInfo", updatedPatient.contactInfo);
        });

        it("should return 404 when updating a non-existent patient", async () => {
            const res = await request(app)
                .put("/api/patients/non-existent-id")
                .send({ name: "No One" });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Patient not found");
        });
    });

    // Test suite for DELETE /api/patients/:patientID
    describe("DELETE /api/patients/:patientID", () => {
        beforeEach(async () => {
            await Patient.create(testPatient);
        });

        afterEach(async () => {
            await cleanupPatients();
        });

        it("should delete a patient", async () => {
            const res = await request(app)
                .delete(`/api/patients/${testPatient.patientID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("message", "Patient deleted successfully");
        });

        it("should return 404 when deleting a non-existent patient", async () => {
            const res = await request(app)
                .delete("/api/patients/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Patient not found");
        });
    });
});
