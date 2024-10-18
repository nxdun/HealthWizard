const Person = require("../models/person");
const Patient = require("../models/patient");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id).select("-password");
    return res.send(person);
  } catch (error) {
    res.status(500).send("Unable to get person");
  }
};

const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(persons);
  } catch (error) {
    res.status(500).send("Unable to get all persons");
  }
};

const login = async (req, res) => {
  try {
    const emailPresent = await Person.findOne({ email: req.body.email });
    if (!emailPresent) {
      return res.status(400).send("Incorrect credentials");
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      return res.status(400).send("Incorrect credentials");
    }
    const isAdmin = emailPresent.type === "Admin";
    const token = jwt.sign(
      { personId: emailPresent._id, isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    res.status(500).send("Unable to login person");
  }
};

//random id generated for patient
const generateRandomID = (prefix) => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  return `${prefix}${randomNumber}`;
};

const register = async (req, res) => {
  try {
    const emailPresent = await Person.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }

    //note : can be added to global conig file
    req.body.patientID = generateRandomID("PAT"); // Generate a random patient ID
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const patient = new Patient({ ...req.body, password: hashedPass });
    const result = await patient.save();
    if (!result) {
      return res.status(500).send("Unable to register patient");
    }
    return res.status(201).send("Patient registered successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

//note : id fixed by applying another search term
const updateProfile = async (req, res) => {
  try {
    // Find the patient by patientID
    const patient = await Patient.findOne({ patientID: req.body.patientID });
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    // Update the person profile using the found patientID
    const result = await Person.findByIdAndUpdate(
      { _id: patient._id },
      { ...req.body, password: hashedPass }
    );
    if (!result) {
      return res.status(500).send("Unable to update person");
    }
    return res.status(201).send("Person updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const deletePerson = async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.locals);
    return res.send("Person deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete person");
  }
};

const createAdmin = async (req, res) => {
  try {
    const emailPresent = await Person.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({ ...req.body, password: hashedPass });
    const result = await admin.save();
    if (!result) {
      return res.status(500).send("Unable to create admin");
    }
    return res.status(201).send("Admin created successfully");
  } catch (error) {
    res.status(500).send("Unable to create admin");
  }
};

module.exports = {
  getPerson,
  getAllPersons,
  login,
  register,
  updateProfile,
  deletePerson,
  createAdmin
};
