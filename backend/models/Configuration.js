// configuration.js
const mongoose = require('mongoose');

// Define the Configuration schema
const configurationSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'globalConfig' }, // Unique key to ensure single entry
    settings: { type: mongoose.Schema.Types.Mixed, required: true } // Use Mixed type for flexible settings
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

// Create the Configuration model
const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;