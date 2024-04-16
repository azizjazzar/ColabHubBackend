const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/MeetingController');

router.post('/add', MeetingController.createMeeting);
router.post('/chatgpt', MeetingController.chatgpt);
router.get('/get', MeetingController.getAllMeetings);
router.put('/update/:meetingId', MeetingController.updateMeeting);
router.get('/getmeets/:freelancerId', MeetingController.getMeetForFreelancer);

// Corrected parameter name to match the controller function
router.delete('/delete/:meetingId', MeetingController.deleteMeeting);

// Ajouter les routes pour remplir une suggestion et afficher une suggestion
router.put('/fill-suggestion/:meetingId', MeetingController.fillSuggestion);
router.get('/display-suggestion/:meetingId', MeetingController.displaySuggestion);

module.exports = router;
