const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/MeetingController');

router.post('/add', MeetingController.createMeeting);
router.get('/get', MeetingController.getAllMeetings);
router.put('/update/:meetingId', MeetingController.updateMeeting);
router.get('/getmeets/:freelancerId', MeetingController.getMeetForFreelancer);

// Corrected parameter name to match the controller function
router.delete('/delete/:meetingId', MeetingController.deleteMeeting);

module.exports = router;
