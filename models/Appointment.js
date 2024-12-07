const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patientID: String,
    doctorName: String,
    date: Date,
    time: String,
    status: { type: String, default: "Scheduled" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);