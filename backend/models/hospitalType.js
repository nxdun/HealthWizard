// hospitalType.js
const GlobalModel = require('./globalModel');

class HospitalType {
    setupHospital() {
        throw new Error('setupHospital() must be implemented');
    }

    getAllowedPaymentMethods() {
        throw new Error('getAllowedPaymentMethods() must be implemented');
    }
}

class GovernmentHospital extends HospitalType {
    setupHospital() {
        console.log('Setting up Government Hospital');
    }

    getAllowedPaymentMethods() {
        // Retrieve payment methods from GlobalModel's config for 'Government' hospitals
        const config = GlobalModel.config;
        return config?.paymentMethods?.Government || [];
    }
}

class PrivateHospital extends HospitalType {
    setupHospital() {
        console.log('Setting up Private Hospital');
    }

    getAllowedPaymentMethods() {
        // Retrieve payment methods from GlobalModel's config for 'Private' hospitals
        const config = GlobalModel.config;
        return config?.paymentMethods?.Private || [];
    }
}

module.exports = {
    HospitalType,
    GovernmentHospital,
    PrivateHospital,
};
