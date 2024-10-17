const express = require('express');
const router = express.Router();
const Configuration = require('../models/configuration');
const GlobalModel = require('../models/globalModel');

// Create a new configuration along with global model
router.post('/', async (req, res) => {
    try {
        const { key, settings } = req.body;

        // Check if a configuration with the same key exists
        const existingConfig = await Configuration.findOne({ key });
        if (existingConfig) {
            return res.status(400).json({ message: `Configuration with key "${key}" already exists.` });
        }

        const config = new Configuration({ key, settings });
        await config.save();

        // Update GlobalModel with the new configuration
        GlobalModel.configureSystem(config.settings);

        res.status(201).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get configuration by key
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;

        // Fetch the settings from the GlobalModel
        const settings = GlobalModel.config;

        // If the config doesn't exist in the GlobalModel, check the database
        if (!settings) {
            const dbSettings = await Configuration.getConfigByKey(key);
            GlobalModel.configureSystem(dbSettings);  // Update the GlobalModel
            return res.status(200).json({ key, settings: dbSettings });
        }

        res.status(200).json({ key, settings });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Update configuration by key
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const newSettings = req.body.settings;

        const updatedConfig = await Configuration.updateConfigByKey(key, newSettings);

        // Update the GlobalModel with the new configuration
        GlobalModel.configureSystem(updatedConfig.settings);

        res.status(200).json(updatedConfig);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete configuration by key
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;

        // Delete configuration from the database
        const config = await Configuration.findOneAndDelete({ key });
        if (!config) {
            return res.status(404).json({ message: `Configuration with key "${key}" not found.` });
        }

        // Reset GlobalModel's config to null
        GlobalModel.configureSystem(null);

        res.status(200).json({ message: `Configuration with key "${key}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all configurations
router.get('/', async (req, res) => {
    try {
        const configs = await Configuration.find({});

        if (configs.length === 0) {
            return res.status(404).json({ message: "No configurations found. Please add configurations to run the server." });
        }

        // Update the GlobalModel with the first config (assuming there's one global config)
        GlobalModel.configureSystem(configs[0].settings);

        res.status(200).json(configs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
