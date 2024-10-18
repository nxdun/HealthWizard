//necessary imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const path = require("path");

//file path imports
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const healthCareManagerRoutes = require("./routes/healthcareManagerRoutes");
const Configuration = require("./models/configuration");
const GlobalModel = require("./models/globalModel");
const staffRoutes = require("./routes/hospitalStaffRoutes");
const personRouter = require("./routes/personRouter.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load configuration into GlobalModel on server startup IIFE Function
// ? lifecycle method ⏬
(async () => {
  try {
    const configKey = "healthwizard"; // Replace with your configuration key
    const settings = await Configuration.getConfigByKey(configKey);
    GlobalModel.configureSystem(settings);
    console.log("\x1b[34m%s\x1b[0m", "Configuration loaded into GlobalModel:");
    console.log("\x1b[36m%s\x1b[0m", JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Error loading configuration:",
      error.message
    );
  }
})();

app.use("/api/records", require("./routes/medRecRoutes.js"));

//auth
app.use("/api/user", personRouter);

//Admin Routes
app.use("/api/admin", require("./routes/adminRoutes.js"));

//todo Squaash those users into 1 route
app.use("/api/clients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/healthcaremanagers", healthCareManagerRoutes);
app.use("/api/staff", staffRoutes);
app.use(express.static(path.join(__dirname, "./client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});

app.listen(port, () => {});

module.exports = app;
