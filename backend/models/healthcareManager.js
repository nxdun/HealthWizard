const mongoose = require("mongoose");
const Person = require("./person");

const healthManagerSchema = new mongoose.Schema({
  HealthManagerID: { type: String, required: true, unique: true },
});

// Methods specific to the Patient model
healthManagerSchema.methods.createAccount = async function () {
  try {
    return await this.save();
  } catch (err) {
    throw new Error("Error creating account: " + err.message);
  }
};

// healthManagerSchema.methods.updateAccount = async function (updateData) {
//   try {
//     Object.assign(this, updateData);
//     return await this.save();
//   } catch (err) {
//     throw new Error("Error updating account: " + err.message);
//   }
// };

// healthManagerSchema.methods.viewMedicalRecords = function () {
//   return this.medicalHistory;
// };

const Health = Person.discriminator("Health", healthManagerSchema);
module.exports = Health;
