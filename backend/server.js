//necessary imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const path = require("path");

//file path imports
const patientRoutes = require('./routes/patientRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const healthCareManagerRoutes = require('./routes/healthcareManagerRoutes');
const Configuration = require('./models/configuration');
const GlobalModel = require('./models/globalModel');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load configuration into GlobalModel on server startup IIFE Function
// ? lifecycle method ⏬
(async () => {
    try {
        const configKey = 'healthwizard'; // Replace with your configuration key
        const settings = await Configuration.getConfigByKey(configKey);
        GlobalModel.configureSystem(settings);
        console.log('\x1b[34m%s\x1b[0m', 'Configuration loaded into GlobalModel:');
        console.log('\x1b[36m%s\x1b[0m', JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error loading configuration:', error.message);
    }
})();

//todo Squaash those users into 1 route
app.use('/api/patients', patientRoutes); //routes for patient methods
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/doctors', doctorRoutes); //routes for doctor methods
app.use('/api/healthcaremanagers', healthCareManagerRoutes);

//Admin Routes
app.use('/api/admin', require('./routes/adminRoutes.js'));

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});

app.listen(port, () => {});

module.exports = app;
