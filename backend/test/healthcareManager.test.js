// tests/healthcareManager.test.js

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Ensure this points to your Express app
const HealthcareManager = require("../models/healthcareManager");

require("dotenv").config();

// Define the testManager data with a specific managerID
const testManager = {
    managerID: "HM001",
    name: "Alice Johnson",
    dob: "1988-11-30",
    department: "Administration",
    contactInfo: "555-4321",
    email: "alice.johnson@example.com",
    address: "654 Care St"
};

// Define the updated data for PUT requests
const updatedManager = {
    name: "u Alice Johnson",
    department: "Neurology"
};

// Cleanup function to remove the test manager
const cleanupManager = async () => {
    await HealthcareManager.deleteMany({ managerID: testManager.managerID });
};

beforeAll(async () => {
    // Connect to the MongoDB test database
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await cleanupManager();
    await mongoose.connection.close();
});

describe("Healthcare Manager API", () => {

    // Test suite for POST /api/healthcaremanagers
    describe("POST /api/healthcaremanagers", () => {
        beforeEach(async () => {
            // Ensure that "HM001" does not exist before each POST test
            await cleanupManager();
        });

        afterEach(async () => {
            // Clean up after each POST test
            await cleanupManager();
        });

        it("should create a new healthcare manager", async () => {
            const res = await request(app)
                .post("/api/healthcaremanagers")
                .send(testManager);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("managerID", testManager.managerID);
            expect(res.body).toHaveProperty("name", testManager.name);
        });

        it("should return an error for missing required fields", async () => {
            const res = await request(app)
                .post("/api/healthcaremanagers")
                .send({}); // Sending empty body
            expect(res.statusCode).toEqual(500); // Adjust based on your error handling
            expect(res.body).toHaveProperty("message", "Error creating healthcare manager");
        });
    });

    // Test suite for GET /api/healthcaremanagers
    describe("GET /api/healthcaremanagers", () => {
        beforeAll(async () => {
            // Insert "HM001" before running GET tests
            await HealthcareManager.create(testManager);
        });

        afterAll(async () => {
            // Clean up after GET tests
            await cleanupManager();
        });

        it("should get all healthcare managers", async () => {
            const res = await request(app).get("/api/healthcaremanagers");
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // Test suite for GET /api/healthcaremanagers/:managerID
    describe("GET /api/healthcaremanagers/:managerID", () => {
        beforeAll(async () => {
            // Ensure "HM001" exists before GET by ID tests
            await HealthcareManager.create(testManager);
        });

        afterAll(async () => {
            // Clean up after GET by ID tests
            await cleanupManager();
        });

        it("should get a healthcare manager by ID", async () => {
            const res = await request(app).get(`/api/healthcaremanagers/${testManager.managerID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("managerID", testManager.managerID);
            expect(res.body).toHaveProperty("name", testManager.name);
        });

        it("should return 404 for a non-existent manager ID", async () => {
            const res = await request(app).get("/api/healthcaremanagers/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Healthcare manager not found");
        });
    });

    // Test suite for PUT /api/healthcaremanagers/:managerID
    describe("PUT /api/healthcaremanagers/:managerID", () => {
        beforeEach(async () => {
            // Insert "HM001" before each PUT test
            await HealthcareManager.create(testManager);
        });

        afterEach(async () => {
            // Clean up after each PUT test
            await cleanupManager();
        });

        it("should update an existing healthcare manager", async () => {
            const res = await request(app)
                .put(`/api/healthcaremanagers/${testManager.managerID}`)
                .send(updatedManager);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("name", updatedManager.name);
            expect(res.body).toHaveProperty("department", updatedManager.department);
        });

        it("should return 404 when updating a non-existent manager", async () => {
            const res = await request(app)
                .put("/api/healthcaremanagers/non-existent-id")
                .send({ name: "No One" });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Healthcare manager not found");
        });
    });

    // Test suite for DELETE /api/healthcaremanagers/:managerID
    describe("DELETE /api/healthcaremanagers/:managerID", () => {
        beforeEach(async () => {
            // Insert "HM001" before each DELETE test
            await HealthcareManager.create(testManager);
        });

        afterEach(async () => {
            // Clean up after each DELETE test
            await cleanupManager();
        });

        it("should delete a healthcare manager", async () => {
            const res = await request(app)
                .delete(`/api/healthcaremanagers/${testManager.managerID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("message", "Healthcare manager deleted successfully");
        });

        it("should return 404 when deleting a non-existent manager", async () => {
            const res = await request(app)
                .delete("/api/healthcaremanagers/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Healthcare manager not found");
        });
    });
});
