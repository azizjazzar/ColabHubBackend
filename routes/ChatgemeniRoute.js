const express = require('express');
const router = express.Router();
const ChatGemeniController = require('../controllers/ChatGemeniController');


// Basic CRUD operations for blogs
router.post('/add', ChatGemeniController.saveResponse);
router.get('/getall', ChatGemeniController.getAllResponses);
router.post('/chatwithgemeni', ChatGemeniController.geminiWithText);


module.exports = router;
