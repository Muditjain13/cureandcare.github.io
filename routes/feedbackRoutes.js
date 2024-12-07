const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// Feedback Form
router.get("/submit", (req, res) => {
    res.render("feedback");
});

// Handle Feedback Submission
router.post("/submit", async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.redirect("/feedback/submit?success=true");
    } catch (error) {
        res.redirect("/feedback/submit?error=true");
    }
});

module.exports = router;