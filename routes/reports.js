const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const reports = require("../models/report");  // Ensure you are using the 'reports' model here
const multer = require("multer");  // Multer for handling file uploads

// Use memory storage to store file as a buffer in memory
const storage = multer.memoryStorage();

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Route to render landing page (optional)
router.get("/landing", (req, res) => {
    res.render("reports");
});

// POST route for uploading a file and storing it in MongoDB
router.post("/upload", upload.single('file'), async (req, res) => {
    try {
        // Log incoming request for debugging
        console.log("came");

        // Extract patient ID and file buffer from the request body and file
        const patid = req.body.patid;
        const fileBuffer = req.file.buffer; // File buffer containing the uploaded file's content

        // Create a new report document using the patient ID and file buffer
        const newReport = new reports({
            patientID: patid,  // Ensure this matches the field name in MongoDB
            file: fileBuffer,  // Store the file as a binary buffer in MongoDB
        });

        // Save the report document to the database
        await newReport.save();
        console.log("Report saved");

        // Send a success response back to the client
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>File Upload Success</title>
            </head>
            <body>
                <script>
                    alert("Uploaded successfully");  
                    window.location.href = "/reports/landing" 
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        // Log any errors for debugging
        console.error("Error during file upload:", error);

        // Send a 500 status code with an error message to the client
        res.status(500).send("Error uploading file: " + error.message);
    }
});

// GET route to retrieve the file for a specific PatientID
router.get("/see", async (req, res) => {
    try {
        const patid = req.query.patientID;  // Use query parameter for GET request (e.g., ?PatientID=value)

        console.log("Received PatientID:", patid);

        // Find the patient by PatientID
        const existingPatient = await Patient.findOne({ patientID: patid });

        if (!existingPatient) {
            console.log("No such patient found");
            return res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>No Patient Found</title>
                </head>
                <body>
                    <script>
                        alert("No Such PatientID Exists");  
                        window.location.href = "/reports/landing";  // Redirect to the reports landing page
                    </script>
                </body>
                </html>
            `);
        }

        // Fetch the report file related to the patient
        const fileRecord = await reports.findOne({ patientID: patid }, "file");

        // Debug: Log the fileRecord object
        console.log("File Record:", fileRecord);

        if (!fileRecord || !fileRecord.file) {
            console.log("No file found for this patient.");
            return res.status(404).send("Report file not found.");
        }

        // Set headers for file download
        res.setHeader("Content-Type", "application/pdf");  // Adjust MIME type based on your file type
        res.setHeader("Content-Disposition", `attachment; filename="report-${patid}.pdf"`);

        // Send the file content (binary data) back to the client
        res.send(fileRecord.file);  // Send the file buffer directly (no need to decode)

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error");
    }
});

// Export the router to use in the main server file (e.g., app.js or server.js)
module.exports = router;
