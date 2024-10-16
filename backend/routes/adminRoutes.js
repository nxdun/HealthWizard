// adminRoutes.js ;] Admin Only
// This file contains routes that are only accessible to admin users. 
const express = require('express');
const router = express.Router();
const Configuration = require('../models/configuration');

// Get configuration settings
router.get('/settings', async (req, res) => {
    try {
        const config = await Configuration.findOne({ key: 'globalConfig' });
        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        const settings = config.getSettings();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving configuration settings', error: err.message });
    }
});

// Set configuration settings
router.put('/settings', async (req, res) => {
    try {
        const config = await Configuration.findOne({ key: 'globalConfig' });
        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        await config.setSettings(req.body);
        res.json({ message: 'Configuration settings updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating configuration settings', error: err.message });
    }
});

module.exports = router;