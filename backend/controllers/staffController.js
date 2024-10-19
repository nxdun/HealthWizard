const Person = require("../models/person");
const Health = require("../models/healthcareManager");
const Staff = require("../models/hospitalStaffMember");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//random id generated
const generateRandomID = (prefix) => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    return `${prefix}${randomNumber}`;
  };

  const registerHealth = async (req, res) => {
    try {
      const emailPresent = await Person.findOne({ email: req.body.email });
      if (emailPresent) {
        return res.status(400).send("Email already exists");
      }
  
      //note : can be added to global conig file
      req.body.HealthManagerID = generateRandomID("HM"); // Generate a random patient ID
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const health = new Health({ ...req.body, password: hashedPass });
      const result = await health.save();
      if (!result) {
        return res.status(500).send("Unable to register Health Manager");
      }
      return res.status(201).send("Health Manager registered successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  };
  const registerStaff = async (req, res) => {
    try {
      const emailPresent = await Person.findOne({ email: req.body.email });
      if (emailPresent) {
        return res.status(400).send("Email already exists");
      }
  
      //note : can be added to global conig file
      req.body.StaffMemberID = generateRandomID("SAT"); // Generate a random patient ID
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const staff = new Staff({ ...req.body, password: hashedPass });
      const result = await staff.save();
      if (!result) {
        return res.status(500).send("Unable to register Staff");
      }
      return res.status(201).send("Staff registered successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  };

  module.exports = {
    registerHealth,
    registerStaff,
  };