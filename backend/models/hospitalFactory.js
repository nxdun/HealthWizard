// hospitalFactory.js (Factory Pattern Implementation)
class HospitalTypeFactory {
    createHospitalType(type) {
        if (type === 'Government') {
            return new GovernmentHospital();
        } else if (type === 'Private') {
            return new PrivateHospital();
        }
        return null; // Return null if the type is not recognized
    }
}

class GovernmentHospital {
    setupHospital() {
        console.log('Setting up Government Hospital');
        // Add additional logic for setting up a Government Hospital here
    }
}

class PrivateHospital {
    setupHospital() {
        console.log('Setting up Private Hospital');
        // Add additional logic for setting up a Private Hospital here
    }
}

module.exports = HospitalTypeFactory;