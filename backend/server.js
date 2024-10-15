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
const staffRoutes = require('./routes/hospitalStaffRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const healthCareManagerRoutes = require('./routes/healthcareManagerRoutes');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes); //routes for patient methods
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes); 
app.use('/api/doctors', doctorRoutes); //routes for doctor methods
app.use('/api/healthcaremanagers', healthCareManagerRoutes);


app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {});

module.exports = app;
