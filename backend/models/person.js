const mongoose = require("mongoose");

// Person schema
const personSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, minLength: 3 },
    lastname: { type: String, required: true, minLength: 3 },
    dob: { type: Date },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    password: { type: String, required: true, minLength: 5 },
    gender: { type: String, default: "neither" },
    mobile: { type: Number },
    digitalCard: { type: String, default: "none" },
    status: { type: String, default: "pending" },
  },
  { discriminatorKey: "type", timestamps: true } // Using 'type' to differentiate models
);

const Person = mongoose.model("Person", personSchema);
module.exports = Person;
