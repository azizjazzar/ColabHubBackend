const taskRoutes = require('./routes/Task');
const contributorRoutes = require('./routes/contributorRoutes');
const contributionRoutes = require('./routes/ContributionRoutes');
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors"); // Ajoutez cette ligne
const app = express();
const stripe = require("stripe")('sk_test_51OErmACis87pjNWpHjxy4jOfBeV5X2cD3bB2op5qNVdo8OY7pqpqJh235cFlSwbjNxfjsz6FMZAD1EVCWJs2kyDq00LYDaUrax');
const jobRoutes = require('./routes/jobOfferRoutes');
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

app.use('/tasks', taskRoutes);

//jobs

app.use('/jobs', jobRoutes);


app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port: ' + 3000);
});
