const taskRoutes = require('./routes/Task');
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors"); // Ajoutez cette ligne
const app = express();
const consultationsRoutes = require('./routes/consultations');
const servicesRoutes = require('./routes/services');
const paymentRoutes = require('./routes/payment');
const blogRoutes = require('./routes/blog');
const jobRoutes = require('./routes/jobOfferRoutes');
const meetingRoutes= require('./routes/meeting');

connectDB();

app.use(express.json());
app.set('views', './public');
app.set('view engine', 'ejs');

// Utilisation de CORS middleware
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api/auth", require("./routes/auth"));

app.use('/consultations', consultationsRoutes);
app.use('/services', servicesRoutes);
app.use('/payment', paymentRoutes);

// Route for tasks
app.use('/tasks', taskRoutes);

// Route for meetings
app.use('/meet', meetingRoutes);

// Blog routes
app.use('/blogs', blogRoutes);

//jobs
app.use('/jobs', jobRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
