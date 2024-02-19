const taskRoutes = require('./routes/Task');
const contributorRoutes = require('./routes/contributorRoutes');
const contributionRoutes = require('./routes/ContributionRoutes');
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
connectDB();

app.use(express.json());
app.set('views', './public');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation de CORS middleware
app.use(cors());

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api/auth", require("./routes/auth"));

// Configurer les routes pour les contributions
app.use("/contributions", contributionRoutes);

// Configurer les routes pour les contributeurs
app.use("/contributors", contributorRoutes);

// Configurer les routes pour les tâches
app.use('/consultations', consultationsRoutes);
app.use('/services', servicesRoutes);

app.use('/tasks', taskRoutes);
app.use('/payment', paymentRoutes);

// Blog routes
app.use('/blogs', blogRoutes);



app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port: ' + 3000);
});
