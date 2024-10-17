const express = require('express');
const router = express.Router();
const { CreditCardPayment, InsurancePayment } = require('../models/paymentStrategy');
const GlobalModel = require('../models/globalModel');
const HospitalTypeFactory = require('../models/hospitalFactory');

// Endpoint to process payment
router.post('/process', async (req, res) => {
    try {
        const { hospitalType, paymentMethod, amount } = req.body;

        // Setup the hospital type using the factory pattern
        const factory = new HospitalTypeFactory();
        const hospital = factory.createHospitalType(hospitalType);

        if (!hospital) {
            return res.status(400).json({ message: 'Invalid hospital type.' });
        }

        // Get allowed payment methods from the hospital
        const allowedPaymentMethods = hospital.getAllowedPaymentMethods();

        // Check if the selected payment method is allowed
        console.log("allowd", allowedPaymentMethods);
        console.log(paymentMethod);
        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: 'Payment method not allowed for this hospital type.' });
        }

        // Select the appropriate payment strategy
        let paymentStrategy;
        if (paymentMethod === 'CreditCard') {
            paymentStrategy = new CreditCardPayment();
        } else if (paymentMethod === 'Insurance') {
            paymentStrategy = new InsurancePayment();
        } else {
            return res.status(400).json({ message: 'Unsupported payment method.' });
        }

        // Process the payment
        paymentStrategy.processPayment(amount);

        // Save the transaction details to the database (example logic)
        // Assume `Payment` is a Mongoose model for storing payment records.
        // const paymentRecord = await Payment.create({
        //     hospitalType,
        //     paymentMethod,
        //     amount,
        //     status: 'Completed'
        // });

        res.status(200).json({
            status: 'success',
            message: `Payment of $${amount} processed successfully using ${paymentMethod}.`,
            // transactionId: paymentRecord._id, // Uncomment when saving the transaction.
            paymentMethod,
            amount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
