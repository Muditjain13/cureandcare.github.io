const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const prescription = require("../models/Prescription")
const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

router.get("/generate", (req, res) => {
    res.render("prescription");
});

router.post("/generate", async (req, res) => {
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
                window.location.href = "/prescription/generate"; 
            </script>
        </body>
        </html>
        `);
        }


        else {

            const newPrescripion = new prescription({
                patientID: req.body.patientID,
                Name: req.body.Name,
                Medicines: req.body.Medicines,
                Test: req.body.Test,
                drname: req.body.Drname,

            });

            await newPrescripion.save();

            // Create PDF document
            const doc = new PDFDocument();

            // Pipe the PDF to the response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=prescription.pdf');
            doc.pipe(res);

            // Add title
            doc.fontSize(16).text('Care And Cure Super Speciality Hospital', { align: 'center' });
            doc.fontSize(12).text('234, Wellness Road, Sector 22, New City, MP, India, 482001', { align: 'center' });
            doc.moveDown();
            doc.fontSize(25).text('Prescription',240,120);
            doc.moveDown();
            // Add patient and bill details
            doc.fontSize(12).text(`Name: ${req.body.Name}`,150,160);
            doc.fontSize(12).text(`Medicines: ${req.body.Medicines}`);

            doc.fontSize(12).fontSize(12).text(`Test: ${req.body.Test}`);
            doc.fontSize(12).text(`Doctor Name:  ${req.body.Drname}`);

            // Add the hospital stamp image (from external URL)


            // Finalize the PDF document
            doc.end();










        }
    }

    catch (error) {


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
                window.location.href = "/prescription/generate";  // Redirect back to the register page after alert
            </script>
        </body>
        </html>
        `);


    }
});





    

module.exports = router;
