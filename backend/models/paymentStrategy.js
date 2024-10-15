
// paymentStrategy.js (Strategy Pattern Implementation)
class PaymentStrategy {
    processPayment(amount) {
        throw new Error('This method should be overridden');
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

module.exports = { PaymentStrategy, CreditCardPayment, InsurancePayment };
