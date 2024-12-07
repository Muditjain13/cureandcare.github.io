const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
let r = 0;
let existingPatient = null;
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    try {
       // const newPatient = new Patient(req.body);
        var patientID = r;
        let se = r.toString();
       
        do {

            r = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
            se = r.toString();
            let existingPatient = await Patient.findOne({ se });
            console.log('Content-Type:', req.headers['content-type'])


        } while (existingPatient);
       
            // Add key-value pairs to the existing JSON object
            req.body.patientID = r.toString();  // Adds a new key-value pair to req.body
            

            console.log(req.body);  // Now the body has the new key-value pairs

           
       
        const newPatient = new Patient(req.body);
        console.log("hehe");
        console.log(req.body);
        await newPatient.save();
        console.log("done111111");
        let val = r.toString();
        console.log(`hehe ${val}`)
       
            res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Patient Registration</title>
        </head>
        <body>
            <script>
                alert("Patient Registered Successfully with id ${val}");  // Display success message
                window.location.href = "/patients/register";  // Redirect back to the register page after alert
            </script>
        </body>
        </html>
        `);
        console.log("done1");
        
    } catch (error) {
        let id = "hehe";
        console.log(error);
        res.send(`
       <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Patient Registration</title>
    </head>
    <body>
        <script>
            alert("Patient Registered Successfully with id: ${id}");
            window.location.href = "/patients/register";  // Redirect back to the register page after alert
        </script>
    </body>
    </html>
        `);
    }
});

module.exports = router;
