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


const Staff = Person.discriminator("Staff", staffMemberSchema);
module.exports = Staff;
