// hospitalFactory.js (Factory Pattern Implementation)
const { GovernmentHospital, PrivateHospital } = require('./hospitalType');
const GlobalModel = require('../models/globalModel');

class HospitalTypeFactory {
    createHospitalType(type) {
        const config = GlobalModel.config; // Get the configuration from the global model
        const paymentMethods = config?.settings?.paymentMethods?.[type] || []; // Get payment methods based on the type

        if (type === 'Government') {
            return new GovernmentHospital(paymentMethods);
        } else if (type === 'Private') {
            return new PrivateHospital(paymentMethods);
        }
        //can add more types here
        return null; // Return null if the type is not recognized
    }
}

module.exports = HospitalTypeFactory;
