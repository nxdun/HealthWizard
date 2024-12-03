const express = require("express");
const personController = require("../controllers/personController.js");
const personRouter = express.Router();

personRouter.get("/getperson/:id", personController.getPerson);
personRouter.get("/getallpersons", personController.getAllPersons);
personRouter.post("/login", personController.login);
personRouter.post("/register", personController.register); // Directly register patient
personRouter.post("/createadmin", personController.createAdmin); // Directly create admin
personRouter.put("/updateprofile", personController.updateProfile);
personRouter.delete("/deleteperson", personController.deletePerson);
personRouter.post("/submitdoctorapplication", personController.submitDoctorApplication);

module.exports = personRouter;
