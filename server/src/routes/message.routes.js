const express  =   require('express');
// const sendMessage = require('../controllers/messageController.js');
const {sendMessage, getMessage} = require('../controllers/messageController.js');
const verifyToken = require('../middleware/authMiddleware.js');

// const verifyToken = require('../middleware/authMiddleware.js');
// import { sendMessage, getMessages } from '../controllers/messageController.js';
// import { verifyToken } from '../middleware/authMiddleware.js';
// import { sendMessage } from './../controllers/message.controller';

const router = express.Router();

// Send a new message
router.post('/send', verifyToken, sendMessage);

// Get all messages between logged-in user and another user
router.get('/:receiverId', verifyToken, getMessage);

module.exports = router;
