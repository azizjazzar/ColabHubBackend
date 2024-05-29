const express = require('express');
const router = express.Router();
const ChatGemeniController = require('../controllers/ChatGemeniController');


// Basic CRUD operations for blogs
router.post('/add', ChatGemeniController.saveResponse);


module.exports = router;
