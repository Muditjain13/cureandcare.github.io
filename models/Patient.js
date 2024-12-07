const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    address: String,
    phone: String,
    patientID: { type: String, unique: true },
    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);