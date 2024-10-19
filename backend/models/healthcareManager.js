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


const Health = Person.discriminator("Health", healthManagerSchema);
module.exports = Health;
