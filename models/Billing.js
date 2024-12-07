const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
    patientID:String,
    reason:String,
    amount: Number,
    paymentMethod: String,
    
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Billing", billingSchema);