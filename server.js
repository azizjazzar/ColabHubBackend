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
const server = require("http").createServer(app);


connectDB();

app.use(express.json());
app.set('views', './public');
app.set('view engine', 'ejs');

// Utilisation de CORS middleware
app.use(cors());
const io = require("socket.io")(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});
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


app.use('/', stats);
app.get('/rtc/:channelName/:expiration', (req, res) => {
  const channelName = req.params.channelName;
  const expiration = req.params.expiration;

  // Set uid to 0 to allow all users to join
  const uid = 0;

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.APP_ID,
    process.env.APP_CERTIFICATE,
    channelName,
    uid, // Use the wildcard UID
    RtcRole.PUBLISHER,
    expiration
  );

  res.json({ token });
});

//socket video call
io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded")
  });
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
      io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });
  socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
  });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
