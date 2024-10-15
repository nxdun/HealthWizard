
// globalModel.js (Singleton Implementation)
// This file contains the singleton implementation of the GlobalModel class.
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
        this.hospitalType = type;
    }

    configureSystem(config) {
        this.config = config;
    }

    static getInstance() {
        if (!GlobalModel.instance) {
            GlobalModel.instance = new GlobalModel();
        }
        return GlobalModel.instance;
    }
}

module.exports = GlobalModel.getInstance();
