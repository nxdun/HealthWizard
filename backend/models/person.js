//inheritance parent class

const mongoose = require('mongoose');

//person schema
//use this to inherit for doctors as well
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    contactInfo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true }
}, { discriminatorKey: 'role', _id: false });  // Using discriminator to differentiate models

const Person = mongoose.model('Person', personSchema);
module.exports = Person;
