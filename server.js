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
const nlp = require('compromise');

const chatRoutes = require("./routes/ChatRoute");
const MessageRoute = require("./routes/MessageRoute");


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

// Route pour la réponse initiale du chatbot
app.get('/api/chatbot/initial', (req, res) => {
  const initialMessage = "Bonjour! Que souhaitez-vous faire sur la plateforme CollabHub?";
  res.json({ response: initialMessage });
});

// Route pour le traitement des messages du chatbot
app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message;
    const botResponse = processChatMessage(userMessage);
    res.json({ response: botResponse });
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

// Import des routes de scraping
const scraperRoutes = require('./routes/scraperRoutes');

// Utilisation des routes de scraping
app.use('/scraping', scraperRoutes);


app.use("/chat", chatRoutes);
app.use("/message", MessageRoute);



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





// Fonction pour traiter les messages du chatbot
const processChatMessage = (message) => {
  try {
    console.log("Received message:", message);

    if (!message || typeof message !== 'string') {
      throw new Error("Invalid message format");
    }

    // Créez une instance complète de Compromise et normalisez le texte
    const doc = nlp(message).normalize().out('text');

    console.log("Doc:", doc);

    // Exemple : générez une réponse basée sur les entités extraites
    const response = generateResponse(doc);

    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    return "Error processing message";
  }
};

// Fonction de génération de réponse basée sur le texte
const generateResponse = (text) => {
  console.log("Text received:", text);

  const lowerText = text.toLowerCase().trim();

  // Utilisation d'expressions régulières pour la correspondance
  if (/(bonjour)/i.test(lowerText)) {
    return "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
  } else if (/(explique|collabhub)/i.test(lowerText)) {
    return "CollabHub est une plateforme collaborative.";
  } else if (/(quel est votre nom)/i.test(lowerText)) {
    return "Je suis un chatbot intelligent. Vous pouvez m'appeler ChatGPT. Comment puis-je vous assister ?";
  } else if (/(comment prendre une consultation|expert)/i.test(lowerText)) {
    return "Pour prendre une consultation avec un expert, vous pouvez visiter la section 'Consultations' de notre plateforme et choisir l'expert qui correspond le mieux à vos besoins.";
  } else if (/(comment voir les services des freelancers)/i.test(lowerText)) {
    return "Pour consulter les services proposés par nos freelancers, vous pouvez accéder à la section 'Services'. Vous y trouverez une variété de services offerts par nos utilisateurs.";
  } else if (/(comment collaborer sur des projets)/i.test(lowerText)) {
    return "Pour collaborer sur des projets avec d'autres utilisateurs, rendez-vous sur la section 'Projets'. Vous pouvez y trouver des projets en cours et proposer votre aide ou créer votre propre projet.";
  } else if (/(comment fonctionne le paiement|paiement)/i.test(lowerText)) {
    return "Le paiement sur notre plateforme est sécurisé et facile. Vous pouvez effectuer des paiements pour les services et consultations via différentes méthodes de paiement acceptées sur notre site.";
  } else if (/(comment contacter le support|aide|support)/i.test(lowerText)) {
    return "Si vous avez besoin d'aide ou de support, vous pouvez nous contacter en utilisant le formulaire de contact sur notre site ou en envoyant un email à notre équipe de support à support@collabhub.com.";
  } else if (/(comment puis-je devenir freelancer|freelancer)/i.test(lowerText)) {
    return "Pour devenir freelancer sur notre plateforme, vous devez vous inscrire en tant que freelancer en remplissant le formulaire d'inscription sur notre site. Une fois inscrit, vous pouvez commencer à proposer vos services aux utilisateurs.";
  } else if (/(comment fonctionne la notation)/i.test(lowerText)) {
    return "La notation des freelancers et des experts se fait par les utilisateurs après avoir utilisé leurs services ou consultations. Les utilisateurs peuvent attribuer une note et laisser un commentaire pour évaluer l'expérience.";
  } else if (/(je veux ecrire un blog|ecrire blog)/i.test(lowerText)) {
    return "je vais vous diriger vers la page blog ";
  } else if (/(je veux faire une consultation|faire consultation)/i.test(lowerText)) {
    return "je vais vous diriger vers la page consultation ";
  } else if (/(je veux faire une collaboration|faire collaboration)/i.test(lowerText)) {
    return "je vais vous diriger vers la page collaboration ";
  } else if (/(je veux trouver un service|trouver serivce)/i.test(lowerText)) {
    return "je vais vous diriger vers la page service ";
  } else {
    // Réponse par défaut
    return "Merci pour votre message. Comment puis-je vous assister aujourd'hui ?";
  }
};






// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
