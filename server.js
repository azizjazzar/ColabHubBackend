const contributionController = require('./controllers/Contribution');
const taskController = require('./controllers/Task');


require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const path = require("path"); // Ajoutez cette ligne
const app = express(); 
const stripe = require("stripe")('sk_test_51OErmACis87pjNWpHjxy4jOfBeV5X2cD3bB2op5qNVdo8OY7pqpqJh235cFlSwbjNxfjsz6FMZAD1EVCWJs2kyDq00LYDaUrax');
connectDB();
app.use(express.json());
app.set('views', './public');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api/auth", require("./routes/auth"));

// Routes for Contribution controller
app.post('/api/contributions', contributionController.createContribution);
app.get('/api/contributions', contributionController.getAllContributions);
app.get('/api/contributions/:contributionId', contributionController.getContributionById);
app.put('/api/contributions/:contributionId', contributionController.updateContributionById);
app.delete('/api/contributions/:contributionId', contributionController.deleteContributionById);

// Routes for Task controller
app.post('/api/tasks', taskController.createTask);
app.get('/api/tasks', taskController.getAllTasks);
app.get('/api/tasks/:taskId', taskController.getTaskById);
app.put('/api/tasks/:taskId', taskController.updateTaskById);
app.delete('/api/tasks/:taskId', taskController.deleteTaskById);

app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port: ' + 3000);
});
