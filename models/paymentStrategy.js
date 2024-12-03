// paymentStrategy.js
// ? Strategy Pattern ⏬
class PaymentStrategy {
    processPayment(amount) {
        throw new Error('processPayment() must be implemented');
    }
}

class CreditCardPayment extends PaymentStrategy {
    processPayment(amount) {
        console.log(`Processing credit card payment of $${amount}`);
    }
}

class InsurancePayment extends PaymentStrategy {
    processPayment(amount) {
        console.log(`Processing insurance payment of $${amount}`);
    }
}

class GovernmentPayment extends PaymentStrategy {
    processPayment(amount) {
        console.log(`Processing government payment of $${amount}`);
    }
}

module.exports = {
    PaymentStrategy,
    CreditCardPayment,
    InsurancePayment,
    GovernmentPayment,
};
