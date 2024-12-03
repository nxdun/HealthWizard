const express = require("express");
const router = express.Router();
const {
  CreditCardPayment,
  InsurancePayment,
  GovernmentPayment,
} = require("../models/paymentStrategy");
const GlobalModel = require("../models/globalModel");
const HospitalTypeFactory = require("../models/hospitalFactory");
const { remove } = require("../models/person");
const Appointment = require("../models/Appointment");
// Endpoint to process payment
router.post("/process", async (req, res) => {
  try {
    const { hospitalType, paymentMethod, amount, appointmentId } = req.body;

    // Setup the hospital type using the factory pattern
    const factory = new HospitalTypeFactory();
    const hospital = factory.createHospitalType(hospitalType);

    if (!hospital) {
      return res.status(400).json({ message: "Invalid hospital type." });
    }

    // Get allowed payment methods from the hospital
    const allowedPaymentMethods = hospital.getAllowedPaymentMethods();

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Payment method not allowed for this hospital type.",
      });
    }

    // Select the appropriate payment strategy
    let paymentStrategy;
    if (paymentMethod === "CreditCard") {
      paymentStrategy = new CreditCardPayment();
    } else if (paymentMethod === "Insurance") {
      paymentStrategy = new InsurancePayment();
    } else if (paymentMethod === "Government") {
      paymentStrategy = new GovernmentPayment();
    } else {
      return res.status(400).json({ message: "Unsupported payment method." });
    }

    // Process the payment
    paymentStrategy.processPayment(amount);

    //set appointment status to paid
    const appointment = await Appointment.findOne({ _id: appointmentId });
    if (!appointment) {
        return res.status(400).json({ message: "Invalid appointment ID." });
    }
    appointment.status = "paid";

    await appointment.save();
    console.log("Appointment status updated to paid");

    res.status(200).json({
      status: "success",
      message: `Payment of $${amount} processed successfully using ${paymentMethod}.`,
      // transactionId: paymentRecord._id, // Uncomment when saving the transaction.
      paymentMethod,
      amount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

module.exports = router;
