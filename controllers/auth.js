const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10; // Nombre de rounds pour le salage du mot de passe
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const activeRefreshTokens = {};
const axios = require('axios');
exports.getTotalUsersCount = async (req, res, next) => {
  try {
    // Récupérer le nombre total d'utilisateurs depuis la base de données
    const count = await User.countDocuments();

    res.status(200).json({ success: true, totalUsers: count });
  } catch (error) {
    console.error('Error fetching total users count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch total users count' });
  }
};
exports.sendEmail = async (req, res, next) => {
    const { masteremail, message, clientemail } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'azizjazz60@gmail.com',
        pass: 'ygwa aydd mnln qzjf',
      },
    });
  
    const mailOptions = {
      from: 'azizjazz60@gmail.com',
      to: `${masteremail}, ${clientemail}`, // Include both email addresses separated by commas
      subject: 'Invitation to Meeting',
      text: `Hello,\n\nYou are invited to a meeting. Here is the link to join:\n\n${message}`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
    }
  };

// Create operation
exports.register = async (req, res, next) => {
  const {
      nom,
      prenom,
      email,
      genre,
      datenaissance,
      telephone,
      adresse,
      mot_passe,
      type,
      picture
  } = req.body;

  try {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(mot_passe, saltRounds);

      const users = await User.create({
        nom,
        prenom,
        email,
        genre,
        datenaissance,
        telephone,
        adresse,
        mot_passe: hashedPassword, // Utilisez le mot de passe hashé
        type,
        picture
      });

      console.log(users);
      res.status(201).json({ success: true, message: "User has been added" });
    } catch (error) {
      next(error);
    }
};

exports.getByEmail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }).select({ __v: 0 });

    if (!user) {
      return res.status(200).json({ success: false, message: "Utilisateur introuvable par email" });
    }

    // Retourne directement les attributs de l'utilisateur sans la clé "user"
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.chatgpt = async (req, res, next) => {
  const { transcribedText } = req.body;

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content: `I will give you a text speech about the user in the meeting and you're gonna give me mood statistics for each time point where the mood can be (happy, sad, nervous, excited), and I want you to format it like this: [(the time), (mood),(the time), (mood) ...]. This is the text: ${transcribedText}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
        },
      }
    );

    const answer = openaiResponse.data.choices[0].message.content;

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Erreur lors de la demande à l'API OpenAI:", error);
    res.status(500).json({ error: "Erreur lors de la demande à l'API OpenAI" });
  }
};
exports.giminiAnalyse = async (req, res, next) => {
  const { transcribedText } = req.body;

  try {
    const googleGeminiURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:  `I will give you a text speech about the user in the meeting and you're gonna give me mood statistics for each time point where the mood can be (happy, sad, nervous, excited), and I want you to format it like this: [(the time), (mood),(the time), (mood) ...]. This is the text: ${transcribedText}`
            }
          ]
        }
      ]
    };

    const response = await axios.post(googleGeminiURL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINIKEY
      }
    });

    // Extraire uniquement le texte de la réponse
    const generatedText = response.data

    // Envoyer uniquement le texte en réponse à l'appelant
    res.json({ text: generatedText });
  } catch (error) {
    // Gérer les erreurs ici
    console.error('Erreur lors de la requête à Google Gemini:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la requête à Google Gemini' });
  }
};


exports.giminiAnalyse = async (req, res, next) => {
  const { transcribedText } = req.body;

  try {
    const googleGeminiURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:  `I will give you a text speech about the user in the meeting and you're gonna give me mood statistics for each time point where the mood can be (happy, sad, nervous, excited), and I want you to format it like this: [(the time), (mood),(the time), (mood) ...]. This is the text: ${transcribedText}`
            }
          ]
        }
      ]
    };

    const response = await axios.post(googleGeminiURL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINIKEY
      }
    });

    // Afficher la structure complète de la réponse
    console.log('Structure de la réponse:', response.data);

    // Envoyer la réponse complète en réponse à l'appelant (pour le débogage)
    res.json(response.data);
  } catch (error) {
    // Gérer les erreurs ici
    console.error('Erreur lors de la requête à Google Gemini:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la requête à Google Gemini' });
  }
};



exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, info: user });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { email } = req.params;
  const updateData = req.body;

  try {
    // Vérifiez si le mot de passe est inclus dans les données de mise à jour
    if (updateData.mot_passe) {
      // Hasher le nouveau mot de passe
      updateData.mot_passe = await bcrypt.hash(updateData.mot_passe, saltRounds);
    }

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found by email" });
    }

    res.status(200).json({ success: true, data: updatedUser, message: "User has been updated" });
  } catch (error) {
    next(error);
  }
};



exports.remove = async (req, res, next) => {
  const { email } = req.params; // Assuming the email is in the params, adjust accordingly
  try {
    const removedUser = await User.findOneAndDelete({ email: email });
    if (!removedUser) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, message: "user has been deleted" });
  } catch (error) {
    next(error);
  }
};


exports.users = async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
};
exports.sendmail = async (req, res, next) => {
  const { email, code } = req.params;

  try {
    // Call a function to send an email with the provided code
    await sendWelcomeEmail(email, code);

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
};




exports.sendEmailToAdmin = async (req, res, next) => {
  const { userEmail, message, clientName } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'azizjazz60@gmail.com',
      pass: 'ygwa aydd mnln qzjf',
    },
  });

  const mailOptions = {
    from: 'azizjazz60@gmail.com',
    to: 'jazzar.aziz@esprit.tn',
    subject: 'Client Reclamation',
    text: `Hello, we received a reclamation from our client ${clientName}.\n\nMessage: ${message}\n\nUser Email: ${userEmail}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.mot_passe);

      if (passwordMatch) {
        const accessTokenPayload = { email: user.email, type: user.type };
        const refreshTokenPayload = { userId: user._id };

        const accessToken = generateToken(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '10s' });
        const refreshToken = generateToken(refreshTokenPayload, 'refreshTokenSecret', { expiresIn: '7d' });

        activeRefreshTokens[refreshToken] = true;

        res.cookie('jwtToken', accessToken, { httpOnly: true, maxAge: 60000 });

        res.json({ type: user.type, success: true, message: 'Connexion réussie', accessToken, refreshToken });
      } else {
        res.json({ success: false, message: 'Email ou mot de passe incorrect' });
      }
    } else {
      res.json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET || 'yourFallbackSecretKey', (err, user) => {
        if (err) {
          return res.status(403).json({ success: false, message: "Token is not valid" });
        }

        req.user = user;

        return res.status(200).json({ success: true, message: "Token is valid", user });
      });
    } else {
      res.status(401).json({ success: false, message: "Authentication header not provided" });
    }
  } catch (error) {
    next(error);
  }
};
exports.comparePasswords = async (req, res, next) => {
  try {
    const { passeNH, passeH } = req.body;

    // Utilisez bcrypt.compare pour comparer le mot de passe non haché avec le mot de passe haché stocké en base de données
    const resultat = await bcrypt.compare(passeNH, passeH);

    // Utilisez la variable "resultat" dans la réponse JSON
    res.json({ resultat });
  } catch (erreur) {
    // Gérez les erreurs lors de la comparaison des mots de passe
    console.error('Erreur lors de la comparaison des mots de passe :', erreur);
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Le token de rafraîchissement est requis dans le corps de la requête.' });
    }

    delete activeRefreshTokens[refreshToken];

    res.cookie('jwtToken', '', { maxAge: 1 });
    res.cookie('refreshToken', '', { maxAge: 1 });

    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ err });
  }
};
exports.updatePicture = async (req, res, next) => {
  try {
    const { email } = req.params;
    
    // Vérifiez si un fichier a été téléchargé avec multer
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Obtenez le nom du fichier d'image téléchargé
    const picture = req.file.originalname;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Mettez à jour le champ picture avec le nom de l'image téléchargée
    user.picture = picture;
    const updatedUser = await user.save();

    res.status(200).json({ success: true, message: "User picture updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};



exports.getImageByEmail = async (req, res, next) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found by email" });
    }

    if (!user.picture) {
      return res.status(404).json({ success: false, message: "User has no picture" });
    }

    // Envoi de l'image directement en utilisant le chemin stocké dans user.picture
    res.sendFile(user.picture);
  } catch (error) {
    next(error);
  }
};

exports.getImageById = async (req, res, next) => {
  const { id } = req.params; 

  try {
    const user = await User.findById(id); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found by id" });
    }

    if (!user.picture) {
      return res.status(404).json({ success: false, message: "User has no picture" });
    }

    // Envoyer l'image directement en utilisant le chemin stocké dans user.picture
    res.sendFile(user.picture);
  } catch (error) {
    next(error);
  }
};



 exports.getByEmailI = async (req, res, next) => {
    const { email } = req.params;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found by email" });
      }
      res.status(200).json({  user });
    } catch (error) {
      next(error);
    }
  };

exports.getByIdI = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
exports.registerI = async (req, res, next) => {
  const {
      nom,
      prenom,
      email,
      genre,
      datenaissance,
      telephone,
      adresse,
      mot_passe,
      type,
      picture
     
      
  } = req.body;

  try {
      const users = await User.create({
        nom,
        prenom,
        email,
        genre,
        datenaissance,
        telephone,
        adresse,
        mot_passe,
        type,
        picture
        
      });
      console.log(users)
      res.status(201).json({ success: true, message: "user has been added" });
    } catch (error) {
      next(error);
    }
  };

exports.updateI = async (req, res, next) => {
  const { email } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found by email" });
    }
    res.status(200).json({ success: true, data: updatedUser, message: "User has been updated" });
  } catch (error) {
    next(error);
  }
};



exports.removeI = async (req, res, next) => {
  const { id } = req.params;
  try {
    const removedUser = await User.findByIdAndRemove(id);
    if (!removedUser) {
      return res.status(404).json({ success: false, message: "Borne not found" });
    }
    res.status(200).json({ success: true, message: "Borne has been deleted" });
  } catch (error) {
    next(error);
  }
};

exports.usersI = async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required in the request body.' });
    }

    if (!activeRefreshTokens[refreshToken]) {
      console.log('Active Refresh Tokens:', activeRefreshTokens);
      return res.status(403).json({ success: false, message: 'Refresh token is not valid or has been invalidated.' });
    }

    jwt.verify(refreshToken, 'refreshTokenSecret', (err, user) => {
      if (err) {
        console.error('Error verifying refresh token:', err);
        return res.status(403).json({ success: false, message: 'Refresh token is not valid' });
      }

      delete activeRefreshTokens[refreshToken];

      const newAccessTokenPayload = { email: user.email, type: user.type };
      const accessToken = generateToken(newAccessTokenPayload, process.env.JWT_SECRET, { expiresIn: '20s' });
      const newRefreshToken = generateToken({ userId: user._id }, 'refreshTokenSecret', { expiresIn: '7d' });

      activeRefreshTokens[newRefreshToken] = true;

      res.cookie('jwtToken', accessToken, { httpOnly: true, maxAge: 3600000 });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 604800000 });

      res.json({ success: true, message: 'Token refreshed successfully', accessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    console.error('Error in refreshToken:', error);
    next(error);
  }
};

// Helper function to generate a JWT token
function generateToken(payload, secret = process.env.JWT_SECRET || 'yourFallbackSecretKey', options = {}) {
  return jwt.sign(payload, secret, options);
}
