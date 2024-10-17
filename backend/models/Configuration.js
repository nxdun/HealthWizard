// models/configuration.js
const mongoose = require('mongoose');

// Define the Configuration schema
const configurationSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'globalConfig' },
    settings: { type: mongoose.Schema.Types.Mixed, required: true }
});

// Instance method to get settings
configurationSchema.methods.getSettings = function() {
    return this.settings;
};

// Instance method to set settings
configurationSchema.methods.setSettings = function(newSettings) {
    this.settings = newSettings;
    return this.save();
};

// Static method to get configuration by key
configurationSchema.statics.getConfigByKey = async function(key) {
    const config = await this.findOne({ key });
    if (!config) {
        throw new Error(`Configuration with key "${key}" not found.`);
    }
    return config.settings;
};

// Static method to update configuration by key
configurationSchema.statics.updateConfigByKey = async function(key, newSettings) {
    let config = await this.findOne({ key });
    if (!config) {
        throw new Error(`Configuration with key "${key}" not found.`);
    }
    config.settings = newSettings;
    return config.save();
};

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;
