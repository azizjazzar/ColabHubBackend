// MeetingController.js
const Meeting = require('../models/meeting')

exports.createMeeting = async (req, res) => {
  try {
    const Meeting = new Meeting(req.body);
    await Meeting.save();
    res.status(201).json(Meeting);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller to get all meetings
exports.getAllMeetings = async (req, res) => {
    try {
      const Meetings = await Meeting.find();
      res.status(200).json(Meetings);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Controller to update a meeting by ID
exports.updateMeeting = async (req, res) => {
    try {
      const Meeting = await Meeting.findByIdAndUpdate(
        req.params.meetingId,
        req.body,
        { new: true }
      );
      if (!Meeting) {
        return res.status(404).json({ error: 'Job Offer not found' });
      }
      res.status(200).json(Meeting);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Controller to delete a meeting by ID
  exports.deleteMeeting = async (req, res) => {
    try {
      const Meeting = await Meeting.findByIdAndDelete(req.params.meetingId);
      if (!Meeting) {
        return res.status(404).json({ error: 'Job Offer not found' });
      }
      res.status(204).send(); // No content on successful deletion
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  // Fonction pour récupérer toutes les meet affectées à un freelancer
exports.getMeetForFreelancer = async (req, res) => {
    try {
      const freelancerId = req.params.freelancerId;
  
      // Vérifiez si l'ID du freelancer est fourni dans la requête
      if (!freelancerId) {
        return res.status(400).json({ error: 'Freelancer ID non fourni' });
      }
  
      // Requête pour trouver les offres d'emploi liées à l'ID du freelancer
      const meets = await Meeting.find({ freelancersId: freelancerId }).exec();
  
      res.status(200).json(meets);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres d\'emploi par ID de freelancer :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };