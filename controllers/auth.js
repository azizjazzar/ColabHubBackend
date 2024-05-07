const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Nombre de rounds pour le salage du mot de passe
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");
const activeRefreshTokens = {};
const axios = require("axios");

function generateToken(payload, secret = process.env.JWT_SECRET, options = {}) {
  return jwt.sign(payload, secret, options);
}
exports.getTotalUsersCount = async (req, res, next) => {
  try {
    // Récupérer le nombre total d'utilisateurs depuis la base de données
    const count = await User.countDocuments();

    res.status(200).json({ success: true, totalUsers: count });
  } catch (error) {
    console.error("Error fetching total users count:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch total users count" });
  }
};
exports.sendEmail = async (req, res, next) => {
  const { masteremail, message, clientemail } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "azizjazz60@gmail.com",
      pass: "ygwa aydd mnln qzjf",
    },
  });

  const mailOptions = {
    from: "azizjazz60@gmail.com",
    to: `${masteremail}, ${clientemail}`, // Include both email addresses separated by commas
    subject: "Invitation to Meeting",
    text: `Hello,\n\nYou are invited to a meeting. Here is the link to join:\n\n${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
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
    picture,
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
      picture,
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
      return res
        .status(200)
        .json({ success: false, message: "Utilisateur introuvable par email" });
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
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
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

exports.geminiAnalyse = async (req, res, next) => {
  const { transcribedText } = req.body;

  try {
    const googleGeminiURL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `I will give you a text speech about the user in the meeting and you're gonna give me mood statistics for each time point don't miss any time i want all of them and the mood can be (happy, sad, nervous, excited,natural ...), and I want you to format it like this: [(the time), (mood),(the time), (mood) ...]. exemple of return i want :"[(15:35:26, nervous), (15:35:35, sad), (15:35:42, excited), (15:35:44, happy)] ..." This is the text now : ${transcribedText}`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(googleGeminiURL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINIKEY,
      },
    });

    // Récupérer le texte généré à partir de la réponse
    const generatedText = response.data.candidates[0].content.parts[0].text;

    // Envoyer le texte généré en réponse
    res.json({ answer: generatedText });
  } catch (error) {
    // Gérer les erreurs ici
    console.error("Erreur lors de la requête à Google Gemini:", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la requête à Google Gemini",
    });
  }
};

exports.geminiAnalyseWithText = async (req, res, next) => {
  const { text } = req.body;

  try {
    const googleGeminiURL =
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${text}`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(googleGeminiURL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINIKEY,
      },
    });

    // Récupérer le texte généré à partir de la réponse
    const generatedText = response.data.candidates[0].content.parts[0].text;

    // Envoyer le texte généré en réponse
    res.json({ answer: generatedText });
  } catch (error) {
    // Gérer les erreurs ici
    console.error("Erreur lors de la requête à Google Gemini:", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la requête à Google Gemini",
    });
  }
};
exports.geminiMoodPrecise = async (req, res, next) => {
  const { text } = req.body;

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "input: 15:43:15: hello I am very happy to have you here 15:43:18:  and I'm sad too"
            },
            {
              text: "output: [(15:43:15, happy), (15:43:18, sad)]"
            },
            {
              text: "input: 16:18:39: hello my name is very happy to have you here 16:18:43:  and I'm so excited to do this 16:18:49:  and I am sad also because you are not answering in the car"
            },
            {
              text: "output: [(16:18:39, happy), (16:18:43, excited), (16:18:49, sad)]"
            },
            {
              text: "input: 16:23:52: hello 16:23:56:  I'm really sorry"
            },
            {
              text: "output: [(16:23:52, natural), (16:23:56, sad)]"
            },
            {
              text: "input: 16:36:53: hello I'm very excited to have you here 16:36:57:  and I'm very happy 16:37:00:  and I'm sad also 16:37:06:  so yeah"
            },
            {
              text: "output: [(16:36:53, excited), (16:36:57, happy), (16:37:00, sad), (16:37:06, natural)]"
            },
            {
              text: "input: 07:15:34: do you hear me 07:15:43:  this this 07:15:52:  out of here 07:15:56:  do you hear me"
            },
            {
              text: "output: [(07:18:36, neutral), (07:18:40, happy), (07:18:44, excited), (07:18:48, neutral), (07:19:00, happy), (07:19:06, neutral), (07:19:09, happy), (07:19:13, excited), (07:19:15, neutral)]"
            },
            {
              text: "input: 07:16:26: To me. 07:16:36: Yeah, that was but the bad idea, to be honest. 07:16:40: Have a good day."
            },
            {
              text: "output: [(07:18:36, neutral), (07:18:40, happy), (07:18:44, excited), (07:18:48, neutral), (07:19:00, happy), (07:19:06, neutral), (07:19:13, excited), (07:19:15, neutral)]"
            },
            {
              text: text 
            },
            {
              text: "output: "
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }
      const rep = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' + process.env.GEMIKEY, requestBody);

        // Extract the text from the response
        let response = rep.data.candidates[0].content.parts[0].text;

        // Supprime le caractère de nouvelle ligne ("\n")
        response = response.trim();

        // Envoie la réponse au client
        res.json({ answer: response });
    } catch (error) {
        console.error("Error during request to Google Gemini:", error);
        // Envoyer une réponse d'erreur au client
        res.status(500).json({
            message: "An error occurred during the request to Google Gemini"
        });
    }
};
exports.gemini2Client = async (req, res, next) => {
  const { text } = req.body;

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "input: Client A:22:14:58: Do you hear me? 22:15:04: Yeah, thank you. So thank you for this meeting. 22:15:07: That was real successful one. 22:15:17: And I learned so much about uh about about about the subject Python which is Python. 22:15:23: And I hope I will see you later. Have a good day.\nClient B:\n22:12:28: Hello. 22:12:34: So we are here to discuss about Python. 22:12:50: I'm really happy to have you uh, as a student and uh, I will. I will try my best to educate you and learn you so much about Python. 22:13:16: Yes. So first you need to learn the basics of Python And some some some some stuff like this.\noutput: confirmed"
            },
            {
              text: "input: Client A:22:17:10: Hello. 22:17:24: So today we are going to learn about React. So React is a great technology that Facebook used in the in the past. 22:17:43: And it's still working right now and people use it so much. So you need to learn it and that's why I'm here, to give you some advice and to learn you some some React process. So. 22:17:50: Uh, so you need to. You need. You need to have a great.22:18:36: Thank you. Have a good day.\nClient B:\n22:19:29: So hello uh, I learned so much about it and today that was a great day for me. I hope. 22:19:44: The that I will learn it more and more and I hope that I will see you again or maybe we will have a discussion after. 22:19:52: Thank you and have a good day.\noutput: confirmed"
            },
            {
              text: "input: Client A:22:23:18: So hello. 22:23:36: I don't know the subject to be honest. I don't have any idea about it and this is a ******* so ******* stressful for me. 22:23:58: And to be honest, it's a really ****** situation that I'm in right now.\nClient B:\n22:24:51: Hello so yes uh, I know. I think the subject is about uh python .22:25:33: So thank you about this meet and have a good day.\noutput: inappropriate"
            },
            {
              text: "input: Client A :22:29:38: So hello uh, I don't know the the Meet is about what? Have a good day.\nClient B:\n22:30:10: So this means UH is really catastrophic. 22:30:15: And I will look into administration. 22:30:22: And I want my money back, to be honest. 22:30:24: Goodbye.\noutput: declined"
            },
            {
              text: "input: Client A: \nClient B:\noutput: declined"
            },
            {
              text: "input: Client A:22:31:46: So hello today. Uh, thank you for your presence. I'm really happy to be here to learn. We'll learn **** more about business and you need so much time to learn it and you will have so much fun with me\nclient B:\n22:32:20: Yeah, uh, this meat is really successful. Thank you and have a good day.\noutput: inappropriate"
            },
            {
              text: text + "\noutput: "
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }  

   const rep = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' + process.env.GEMIKEY, requestBody);

        // Extract the text from the response
        let response = rep.data.candidates[0].content.parts[0].text;

        // Supprime le caractère de nouvelle ligne ("\n")
        response = response.trim();

        // Envoie la réponse au client
        res.json({ answer: response });
    } catch (error) {
        console.error("Error during request to Google Gemini:", error);
        // Envoyer une réponse d'erreur au client
        res.status(500).json({
            message: "An error occurred during the request to Google Gemini"
        });
    }
};


exports.chatgptAnalyse = async (req, res, next) => {
  const { transcribedText } = req.body;

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
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

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
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
      updateData.mot_passe = await bcrypt.hash(
        updateData.mot_passe,
        saltRounds
      );
    }

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found by email" });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};
exports.updatebyId = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Vérifiez si le mot de passe est inclus dans les données de mise à jour
    if (updateData.mot_passe) {
      // Hasher le nouveau mot de passe
      updateData.mot_passe = await bcrypt.hash(
        updateData.mot_passe,
        saltRounds
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found by id" });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { email } = req.params; // Assuming the email is in the params, adjust accordingly
  try {
    const removedUser = await User.findOneAndDelete({ email: email });
    if (!removedUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
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

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

exports.sendEmailToAdmin = async (req, res, next) => {
  const { userEmail, message, clientName } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "azizjazz60@gmail.com",
      pass: "ygwa aydd mnln qzjf",
    },
  });

  const mailOptions = {
    from: "azizjazz60@gmail.com",
    to: "jazzar.aziz@esprit.tn",
    subject: "Client Reclamation",
    text: `Hello, we received a reclamation from our client ${clientName}.\n\nMessage: ${message}\n\nUser Email: ${userEmail}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.mot_passe))) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou mot de passe incorrect" });
    }

    const accessTokenPayload = {
      _id: user._id,
      email: user.email,
      type: user.type,
    };
    const refreshTokenPayload = { userId: user._id };

    const accessToken = generateToken(
      accessTokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "23h" }
    );
    const refreshToken = generateToken(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    activeRefreshTokens[refreshToken] = true;

    res.cookie("jwtToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 23 * 60 * 60 * 1000,
    });
    res.json({
      type: user.type,
      success: true,
      message: "Connexion réussie",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(
        token,
        process.env.JWT_SECRET || "yourFallbackSecretKey",
        (err, user) => {
          if (err) {
            return res
              .status(403)
              .json({ success: false, message: "Token is not valid" });
          }

          req.user = user;

          return res
            .status(200)
            .json({ success: true, message: "Token is valid", user });
        }
      );
    } else {
      res.status(401).json({
        success: false,
        message: "Authentication header not provided",
      });
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
    console.error("Erreur lors de la comparaison des mots de passe :", erreur);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message:
          "Le token de rafraîchissement est requis dans le corps de la requête.",
      });
    }

    delete activeRefreshTokens[refreshToken];

    res.cookie("jwtToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });

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
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    // Obtenez le nom du fichier d'image téléchargé
    const picture = req.file.originalname;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Mettez à jour le champ picture avec le nom de l'image téléchargée
    user.picture = picture;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.getImageByEmail = async (req, res, next) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found by email" });
    }

    if (!user.picture) {
      return res
        .status(404)
        .json({ success: false, message: "User has no picture" });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found by id" });
    }

    if (!user.picture) {
      return res
        .status(404)
        .json({ success: false, message: "User has no picture" });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found by email" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.getByIdI = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
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
    picture,
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
      picture,
    });
    console.log(users);
    res.status(201).json({ success: true, message: "user has been added" });
  } catch (error) {
    next(error);
  }
};

exports.updateI = async (req, res, next) => {
  const { email } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found by email" });
    }
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.removeI = async (req, res, next) => {
  const { id } = req.params;
  try {
    const removedUser = await User.findByIdAndRemove(id);
    if (!removedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Borne not found" });
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
      return res.status(400).json({
        success: false,
        message: "Refresh token is required in the request body.",
      });
    }

    if (!activeRefreshTokens[refreshToken]) {
      console.log("Active Refresh Tokens:", activeRefreshTokens);
      return res.status(403).json({
        success: false,
        message: "Refresh token is not valid or has been invalidated.",
      });
    }

    jwt.verify(refreshToken, "refreshTokenSecret", (err, user) => {
      if (err) {
        console.error("Error verifying refresh token:", err);
        return res
          .status(403)
          .json({ success: false, message: "Refresh token is not valid" });
      }

      delete activeRefreshTokens[refreshToken];

      const newAccessTokenPayload = { email: user.email, type: user.type };
      const accessToken = generateToken(
        newAccessTokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "20s" }
      );
      const newRefreshToken = generateToken(
        { userId: user._id },
        "refreshTokenSecret",
        { expiresIn: "7d" }
      );

      activeRefreshTokens[newRefreshToken] = true;

      res.cookie("jwtToken", accessToken, { httpOnly: true, maxAge: 3600000 });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 604800000,
      });

      res.json({
        success: true,
        message: "Token refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    next(error);
  }
};

// Helper function to generate a JWT token
function generateToken(
  payload,
  secret = process.env.JWT_SECRET || "yourFallbackSecretKey",
  options = {}
) {
  return jwt.sign(payload, secret, options);
}
