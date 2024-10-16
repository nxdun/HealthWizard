// routes/configurationRoutes.js
const express = require('express');
const router = express.Router();
const Configuration = require('../models/configuration');

// Create a new configuration
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
        res.status(201).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get configuration by key
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const settings = await Configuration.getConfigByKey(key);
        res.status(200).json({ key, settings });
    } catch (error) {
        res.status(404).json({ message: "Not Found " });
    }
});

// Update configuration by key
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const newSettings = req.body.settings;

        const updatedConfig = await Configuration.updateConfigByKey(key, newSettings);
        res.status(200).json(updatedConfig);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete configuration by key
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const config = await Configuration.findOneAndDelete({ key });
        if (!config) {
            return res.status(404).json({ message: `Configuration with key "${key}" not found.` });
        }
        res.status(200).json({ message: `Configuration with key "${key}" deleted successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all configurations ;/
router.get('/', async (req, res) => {
    try {
        const configs = await Configuration.find({});

        //null check
        if (configs.length === 0) {
            return res.status(404).json({ message: "Not Found Any Config Please Add Them To Run the Server Properly" });
        }
        res.status(200).json(configs);
    } catch (error) {
        res.status(500).json({ message: "Error From Behind Please Contact Admin" });
    }
});

module.exports = router;
