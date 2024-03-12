const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/statistiqueController');

router.post('/stats/add', MeetingController.addStatistique);
module.exports = router;
