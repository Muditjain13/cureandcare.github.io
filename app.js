const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect("mongodb+srv://jainmudit100:123@hospitaldb.j7amh.mongodb.net/?retryWrites=true&w=majority&appName=hospitaldb", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

// Routes for other modules
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const PharmacyRoutes = require("./routes/PharmacyRoutes");
// Home route to display images
app.get("/", (req, res) => {
    const images = [
        { src: '/images/img1.jpg', caption: 'State-of-the-Art Building' },
        { src: '/images/img2.jpg', caption: 'Compassionate Care for All' },
        { src: '/images/img3.jpg', caption: 'High-Tech Wards' },
        { src: '/images/img4.jpg', caption: 'Experienced Team' },
        { src: '/images/img5.jpg', caption: 'Prestigious Awards' }
    ];
   
    res.render('home', { images:images }); // Pass images array to home.ejs
});


// Use routes for other functionalities
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/billing", billingRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/prescription",PharmacyRoutes);
// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
