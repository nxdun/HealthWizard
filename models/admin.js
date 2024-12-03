const mongoose = require("mongoose");
const Person = require("./person");

// Admin schema
const adminSchema = new mongoose.Schema({
  adminID: { type: String, required: true, unique: true },
  department: { type: String, default: "Administration" },
});

// Admin-specific methods here

const Admin = Person.discriminator("Admin", adminSchema);
module.exports = Admin;
