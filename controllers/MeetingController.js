// MeetingController.js
const Meeting = require('../models/meeting');

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
