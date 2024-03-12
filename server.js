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
const stats= require('./routes/statistiques');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');


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
app.use('/', stats);
app.get('/rtc/:channelName/:uid/:expiration', (req, res) => {
  const channelName = req.params.channelName;
  const uid = req.params.uid;
  const  expiration=req.params.expiration;

  const key = RtcTokenBuilder.buildTokenWithUid(
    process.env.APP_ID,
    process.env.APP_CERTIFICATE,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    expiration
  );

  res.json({ token: key });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
