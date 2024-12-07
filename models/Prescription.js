const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientID:String,
    Name:String,
    Medicines:String,
    Test: String,
    Drname:String
});

module.exports = mongoose.model("prescription", prescriptionSchema);