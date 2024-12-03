// globalModel.js 
// ? Singleton Pattern ⏬ only 1 instance of this class can be created
class GlobalModel {
    constructor() {
        if (!GlobalModel.instance) {
            this.config = null;
            this.hospitalType = null;
            GlobalModel.instance = this;
        }
        return GlobalModel.instance;
    }

    setupHospitalType(type) {
        const factory = new HospitalTypeFactory();
        this.hospitalType = factory.createHospitalType(type);
    }

    configureSystem(config) {
        this.config = config;
        if (this.hospitalType) {
            this.setupHospitalType(this.hospitalType.constructor.name); // Reinitialize hospital type with updated config
        }
    }

    static getInstance() {
        if (!GlobalModel.instance) {
            GlobalModel.instance = new GlobalModel();
        }
        return GlobalModel.instance;
    }
}

module.exports = GlobalModel.getInstance();
