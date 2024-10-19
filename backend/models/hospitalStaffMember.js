const mongoose = require("mongoose");
const Person = require("./person");

const staffMemberSchema = new mongoose.Schema({
  StaffMemberID: { type: String, required: true, unique: true },
});

// Methods specific to the Patient model
staffMemberSchema.methods.createAccount = async function () {
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

const Staff = Person.discriminator("Staff", staffMemberSchema);
module.exports = Staff;
