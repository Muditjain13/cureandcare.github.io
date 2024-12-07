const express = require("express");
const router = express.Router();
const Billing = require("../models/Billing");
const Patient = require('../models/Patient');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');
const path = require('path');


router.get("/generate", (req, res) => {
    res.render("billing");
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
                        alert("No Such PatientID Exists");  
                        window.location.href = "/billing/generate";  
                    </script>
                </body>
                </html>
            `);
        } else {
            var name = existingPatient.name;
            const reason = req.body.reason;
            const amount = req.body.amount;
            const method = req.body.paymentMethod;

            const newbill = new Billing({
                patientID: req.body.patientID,
                Name: req.body.name,
                Reason: req.body.reason,
                amount: req.body.amount,
                method: req.body.paymentMethod,
               
            })
            await newbill.save();

            // Create PDF document
            const doc = new PDFDocument();

            // Pipe the PDF to the response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=hospital_bill.pdf');
            doc.pipe(res);

            // Add title
            doc.fontSize(16).text('Care And Cure Super Speciality Hospital', { align: 'center' });
            doc.fontSize(12).text('234, Wellness Road, Sector 22, New City, MP, India, 482001', { align: 'center' });
            doc.moveDown();

            // Add patient and bill details
            doc.text(`Bill To: ${name}`);
            doc.text(`Date: ${new Date().toLocaleDateString()}`);
            doc.text('-------------------------------------------');
            doc.text(`Service: ${reason}`);
            doc.text(`Amount: Rs ${amount}`);
            doc.text('-------------------------------------------');
            doc.text(`Payment Mode: ${method}`);
            doc.text('-------------------------------------------');
            doc.text(`Total: Rs ${amount}`, { align: 'right' });

            // Add the hospital stamp image (from external URL)
            const imageUrl = 'https://i.ibb.co/r7PJV7H/STAMP.jpg';

            // Fetch the image as a buffer
            axios({
                method: 'get',
                url: imageUrl,
                responseType: 'arraybuffer'  // Get the image as a buffer
            })
                .then(response => {
                    // Convert the image data into a buffer
                    const imageBuffer = Buffer.from(response.data);

                    // Add the image to the PDF (width of 90)
                    doc.image(imageBuffer, { width: 90 });

                    // Finalize the PDF document
                    doc.end();
                })
                .catch(error => {
                    console.log('Error fetching image:', error);
                    res.status(500).send('Error generating PDF');
                });

        }
    } catch (error) {
        console.log(error);
        res.redirect("/billing/generate?error=true");
    }
});

module.exports = router;
