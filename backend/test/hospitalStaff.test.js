// tests/hospitalStaff.test.js

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const HospitalStaff = require("../models/hospitalStaff");

require("dotenv").config();

// Define the test staff data with a unique staffID
const testStaff = {
    staffID: "S001", // Use a specific ID for testing
    name: "Jane Doe",
    dob: "1985-06-20",
    staffRole: "Nurse",
    department: "Pediatrics",
    contactInfo: "555-5678",
    email: "jane.doe@example.com",
    address: "456 Wellness Avenue"
};

// Define the updated data
const updatedStaff = {
    name: "Jane Smith",
    department: "Cardiology"
};

// Cleanup function to remove test staff
const cleanupStaff = async () => {
    await HospitalStaff.deleteMany({ staffID: testStaff.staffID });
};

beforeAll(async () => {
    // Connect to the MongoDB test database
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await cleanupStaff();
    await mongoose.connection.close();
});

describe("Hospital Staff API", () => {

    // Test suite for POST /api/staff
    describe("POST /api/staff", () => {
        afterEach(async () => {
            await cleanupStaff();
        });

        it("should create a new hospital staff member", async () => {
            const res = await request(app)
                .post("/api/staff")
                .send(testStaff);
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("staffID", testStaff.staffID);
            expect(res.body).toHaveProperty("name", testStaff.name);
        });

        it("should return an error for duplicate staffID", async () => {
            await request(app)
                .post("/api/staff")
                .send(testStaff); // Create first entry

            const res = await request(app)
                .post("/api/staff")
                .send(testStaff); // Attempt to create a duplicate
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Staff member with this ID already exists");
        });

        it("should return an error for missing required fields", async () => {
            const res = await request(app)
                .post("/api/staff")
                .send({}); // Sending empty body
            expect(res.statusCode).toEqual(500); // Adjust based on your error handling
            expect(res.body).toHaveProperty("message", "Error creating staff member");
        });
    });

    // Test suite for GET /api/staff
    describe("GET /api/staff", () => {
        beforeAll(async () => {
            // Insert a test staff member before running GET tests
            await HospitalStaff.create(testStaff);
        });

        afterAll(async () => {
            await cleanupStaff();
        });

        it("should get all hospital staff members", async () => {
            const res = await request(app).get("/api/staff");
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // Test suite for GET /api/staff/:staffID
    describe("GET /api/staff/:staffID", () => {
        beforeAll(async () => {
            await HospitalStaff.create(testStaff);
        });

        afterAll(async () => {
            await cleanupStaff();
        });

        it("should get a hospital staff member by ID", async () => {
            const res = await request(app).get(`/api/staff/${testStaff.staffID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("staffID", testStaff.staffID);
            expect(res.body).toHaveProperty("name", testStaff.name);
        });

        it("should return 404 for a non-existent staff ID", async () => {
            const res = await request(app).get("/api/staff/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Staff member not found");
        });
    });

    // Test suite for PUT /api/staff/:staffID
    describe("PUT /api/staff/:staffID", () => {
        beforeEach(async () => {
            await HospitalStaff.create(testStaff);
        });

        afterEach(async () => {
            await cleanupStaff();
        });

        it("should update an existing hospital staff member", async () => {
            const res = await request(app)
                .put(`/api/staff/${testStaff.staffID}`)
                .send(updatedStaff);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("name", updatedStaff.name);
            expect(res.body).toHaveProperty("department", updatedStaff.department);
        });

        it("should return 404 when updating a non-existent staff member", async () => {
            const res = await request(app)
                .put("/api/staff/non-existent-id")
                .send({ name: "No One" });
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Staff member not found");
        });
    });

    // Test suite for DELETE /api/staff/:staffID
    describe("DELETE /api/staff/:staffID", () => {
        beforeEach(async () => {
            await HospitalStaff.create(testStaff);
        });

        afterEach(async () => {
            await cleanupStaff();
        });

        it("should delete a hospital staff member", async () => {
            const res = await request(app)
                .delete(`/api/staff/${testStaff.staffID}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("message", "Staff member deleted successfully");
        });

        it("should return 404 when deleting a non-existent staff member", async () => {
            const res = await request(app)
                .delete("/api/staff/non-existent-id");
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty("message", "Staff member not found");
        });
    });
});
