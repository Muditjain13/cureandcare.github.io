const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    patientID: String,
    file: Buffer,
    
});

module.exports = mongoose.model("report", reportSchema);