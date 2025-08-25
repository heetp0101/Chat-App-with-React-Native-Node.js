// import Message from '../models/Message.js';
const Message = require('../models/Message.js');
// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id; // from verifyToken middleware

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'receiverId and content are required' });
    }

    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text: content
      });
      
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all messages between sender and receiver
exports.getMessages = async (req, res) => {
  try {
    const senderId = req.user.id; // logged-in user
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 }); // sort by time

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

