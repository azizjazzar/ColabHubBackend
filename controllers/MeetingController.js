// MeetingController.js
const Meeting = require('../models/meeting');
const axios = require('axios');




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
            content: `give me some question to ask in this subject : ${transcribedText}`,
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



exports.createMeeting = async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body);
    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const allMeetings = await Meeting.find();
    res.status(200).json(allMeetings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to update a meeting by ID
exports.updateMeeting = async (req, res) => {
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.meetingId,
      req.body,
      { new: true }
    );
    if (!updatedMeeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.status(200).json(updatedMeeting);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a meeting by ID
exports.deleteMeeting = async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.meetingId);
    if (!deletedMeeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve all meetings assigned to a freelancer
exports.getMeetForFreelancer = async (req, res) => {
  try {
    const freelancerId = req.params.freelancerId;

    // Check if the freelancer ID is provided in the request
    if (!freelancerId) {
      return res.status(400).json({ error: 'Freelancer ID not provided' });
    }

    // Query to find meetings related to the freelancer ID
    const meetings = await Meeting.find({ freelancersId: freelancerId }).exec();

    res.status(200).json(meetings);
  } catch (error) {
    console.error('Error retrieving meetings by freelancer ID:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.displaySuggestion = async (req, res) => {
  try {
    const meetingId = req.params.meetingId;

    // Vérifiez si l'ID de la réunion est fourni dans la demande
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID not provided' });
    }

    // Recherchez la réunion par ID
    const meeting = await Meeting.findById(meetingId).exec();

    // Vérifiez si la réunion existe
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Récupérez la suggestion de la réunion
    const suggestion = meeting.suggestion;

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error('Error displaying suggestion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.fillSuggestion = async (req, res) => {
  try {
    const { suggestion } = req.body;
    const meetingId = req.params.meetingId;

    // Vérifiez si l'ID de la réunion est fourni dans la demande
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID not provided' });
    }

    // Recherchez la réunion par ID
    const meeting = await Meeting.findById(meetingId).exec();

    // Vérifiez si la réunion existe
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Mettez à jour la suggestion de la réunion
    meeting.suggestion = suggestion;
    await meeting.save();

    res.status(200).json({ message: 'Suggestion filled successfully', meeting });
  } catch (error) {
    console.error('Error filling suggestion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller to get a meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meetingId = req.params.meetingId;

    // Check if the meeting ID is provided in the request
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID not provided' });
    }

    // Query to find the meeting by ID
    const meeting = await Meeting.findById(meetingId).exec();

    // Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.status(200).json(meeting);
  } catch (error) {
    console.error('Error retrieving meeting by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


