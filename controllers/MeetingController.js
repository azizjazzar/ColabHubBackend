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
