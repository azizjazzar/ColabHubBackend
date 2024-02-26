const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/MeetingController');


router.post('/add', MeetingController.createMeeting);


router.get('/get', MeetingController.getAllMeetings);


router.put('/update/:meetingId', MeetingController.updateMeeting);

router.get('/getmeets/:freelancerId', MeetingController.getMeetForFreelancer);

router.delete('/delete/:meeting', MeetingController.deleteMeeting);

module.exports = router;
