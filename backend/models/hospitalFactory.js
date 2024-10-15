
// hospitalFactory.js (Factory Pattern Implementation)
class HospitalTypeFactory {
    createHospitalType(type) {
        if (type === 'Government') {
            return new GovernmentHospital();
        } else if (type === 'Private') {
            return new PrivateHospital();
        }
        return null;
    }
}

class GovernmentHospital {
    setupHospital() {
        console.log('Setting up Government Hospital');
    }
}

class PrivateHospital {
    setupHospital() {
        console.log('Setting up Private Hospital');
    }
}

module.exports = HospitalTypeFactory;
