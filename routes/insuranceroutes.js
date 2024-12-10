const express = require("express");
const router = express.Router();

// GET request to display the initial form
router.get("/add", (req, res) => {
    res.render("insurance", {
        formDetails: null,
        showDetailsFound: false,
        showLoader: false, // Initially no loader
        remainingAmount: null,
        error: null
    });
});

// POST request to handle form submission and simulate loader
router.post('/insurance/check', (req, res) => {
    const { patientID, insurance, policyno, bill } = req.body;

    // Ensure values are correctly extracted from the body (logging helps)
    console.log('Policy Number:', policyno);

    const remainingAmount = (bill * 0.1).toFixed(2); // Example of remaining amount calculation
    const checkmark = ''; // Just an example for the checkmark

    // Ensure formDetails is properly passed
    res.render('insurance', {
        formDetails: {
            patientID,
            insurance,
            policyNumber: policyno, // Ensure this is populated correctly
            billAmount: bill
        },
        showDetailsFound: true, // Show details
        showLoader: false, // Hide the loader
        remainingAmount,
        error: null,
        checkmark
    });
});

module.exports = router;
