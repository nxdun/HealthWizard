const bcrypt = require("bcrypt");
const PersonFactory = require("../factories/personFactory");
const healthRepository = require("../repositories/healthRepository");
const staffRepository = require("../repositories/staffRepository");

const generateRandomID = (prefix) => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  return `${prefix}${randomNumber}`;
};

const registerHealth = async (req, res) => {
  try {
    const emailPresent = await healthRepository.findByEmail(req.body.email);
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }

    req.body.HealthManagerID = generateRandomID("HM");
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    // Use Factory Pattern to create a Health Manager
    const health = PersonFactory.createPerson("health", { ...req.body, password: hashedPass });
    
    const result = await healthRepository.save(health);
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
    const emailPresent = await staffRepository.findByEmail(req.body.email);
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }

    req.body.StaffMemberID = generateRandomID("SAT");
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    // Use Factory Pattern to create a Staff Member
    const staff = PersonFactory.createPerson("staff", { ...req.body, password: hashedPass });

    const result = await staffRepository.save(staff);
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
