const express = require("express");
const staffController = require("../controllers/staffController");
const staffRoutes = express.Router();

staffRoutes.post("/registerHealth", staffController.registerHealth); // Directly register Health Manager
staffRoutes.post("/registerStaff", staffController.registerStaff); // Directly register Staff Member


module.exports = staffRoutes;