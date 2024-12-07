const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
   name:String,
   email:String,
    date: { type: Date, default: Date.now },
    feedback:String
});

module.exports = mongoose.model("Feedback", feedbackSchema);