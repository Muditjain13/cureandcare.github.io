const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient")

router.get("/schedule", (req, res) => {
    res.render("appointment");
});

router.post("/schedule", async (req, res) => {
    try {
        

        var patientID = req.body.patientID;
        const existingPatient = await Patient.findOne({ patientID });
        if (!existingPatient) {
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
                alert("No Such Patient ID Exists");  
                window.location.href = "/appointments/schedule";  // Redirect back to the register page after alert
            </script>
        </body>
        </html>
        `);
        }
        else {
            const newAppointment = new Appointment({
                patientID: req.body.patientID,
                doctorName: req.body.doctorName,
                date: req.body.date,
                time: req.body.time,

            });

            await newAppointment.save();
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
                alert("Appointment Fixed");  
                window.location.href = "/appointments/schedule";  // Redirect back to the register page after alert
            </script>
        </body>
        </html>
        `);
        }
        
       
    } catch (error) {
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
                alert("Some Error Occured");  
                window.location.href = "/appointments/schedule";  // Redirect back to the register page after alert
            </script>
        </body>
        </html>
        `);
    }
});

module.exports = router;