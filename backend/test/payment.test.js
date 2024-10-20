// tests/payment.test.js
const request = require("supertest");
const app = require("../server"); // Make sure this is the correct path to your Express app
const {
  PaymentStrategy,
  CreditCardPayment,
  InsurancePayment,
  GovernmentPayment,
} = require("../models/paymentStrategy");
const HospitalTypeFactory = require("../models/hospitalFactory");
const GlobalModel = require("../models/globalModel");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
jest.mock("../models/paymentStrategy"); // Mock payment strategies
jest.mock("../models/hospitalFactory"); // Mock hospital factory

//sample appointment data for testing
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

describe("Payment API", () => {
  beforeAll(() => {
    // Set up global config if necessary
    GlobalModel.config = {
      settings: {
        paymentMethods: {
          Government: ["CreditCard", "Insurance", "Government"],
          Private: ["CreditCard", "Insurance"],
        },
      },
    };
  });

  afterAll(async () => {
    await Appointment.deleteMany({}); // Remove appointments to test empty state
  });

  describe("POST /api/payments/process", () => {
    it("should process a credit card payment successfully", async () => {
      // Mock the hospital type factory to return a mock hospital with allowed payment methods
      const mockHospital = {
        getAllowedPaymentMethods: jest
          .fn()
          .mockReturnValue(["CreditCard", "Insurance"]),
      };
      HospitalTypeFactory.prototype.createHospitalType.mockReturnValue(
        mockHospital
      );

      const res = await request(app)
        .post("/api/appointments")
        .send(appointmentData);

    const aid = res.body.appointment._id;

      const response = await request(app).post("/api/payments/process").send({
        appointmentId: aid,
        hospitalType: "Private",
        paymentMethod: "CreditCard",
        amount: 250,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toContain(
        "Payment of $250 processed successfully using CreditCard."
      );
    });

    it("should return an error for invalid hospital type", async () => {
      HospitalTypeFactory.prototype.createHospitalType.mockReturnValue(null);

      const response = await request(app).post("/api/payments/process").send({
        hospitalType: "InvalidType",
        paymentMethod: "CreditCard",
        amount: 250,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Invalid hospital type.");
    });

    it("should return an error for unsupported payment method", async () => {
      const mockHospital = {
        getAllowedPaymentMethods: jest.fn().mockReturnValue(["CreditCard"]),
      };
      HospitalTypeFactory.prototype.createHospitalType.mockReturnValue(
        mockHospital
      );

      const response = await request(app).post("/api/payments/process").send({
        hospitalType: "Private",
        paymentMethod: "Insurance", // This method is not allowed in the mock hospital
        amount: 250,
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        "Payment method not allowed for this hospital type."
      );
    });

    it("should return an error for missing required fields", async () => {
      const response = await request(app)
        .post("/api/payments/process")
        .send({}); // No data provided

      expect(response.statusCode).toBe(400); // Adjust based on your validation
      expect(response.body.message).toContain(
        "Payment method not allowed for this hospital type"
      ); // Adjust as needed based on validation
    });
  });
});
