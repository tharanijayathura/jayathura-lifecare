// server/routes/chat.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { getBotResponse } = require('../utils/chatbot');

// Get or create chat for patient
router.get('/conversation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let chat;
    if (userRole === 'patient') {
      chat = await Chat.findOne({ patientId: userId }).populate('pharmacistId', 'name email');
    } else if (userRole === 'pharmacist' || userRole === 'admin') {
      // For pharmacist, get all active chats or specific patient chat
      const patientId = req.query.patientId;
      if (patientId) {
        chat = await Chat.findOne({ patientId }).populate('patientId', 'name email');
      } else {
        // Get all active chats
        const chats = await Chat.find({ status: 'active' })
          .populate('patientId', 'name email')
          .sort({ lastMessageAt: -1 });
        return res.json(chats);
      }
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!chat) {
      // Create new chat for patient
      if (userRole === 'patient') {
        chat = new Chat({
          patientId: userId,
          messages: [],
          status: 'active',
        });
        await chat.save();
      } else {
        return res.status(404).json({ message: 'Chat not found' });
      }
    }

    res.json(chat);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all conversations (for pharmacist/admin)
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== 'pharmacist' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chats = await Chat.find({ status: 'active' })
      .populate('patientId', 'name email')
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { chatId, message, patientId } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;
    const userName = req.user.name;

    let chat;
    if (userRole === 'patient') {
      chat = await Chat.findOne({ patientId: userId });
      if (!chat) {
        chat = new Chat({
          patientId: userId,
          messages: [],
          status: 'active',
        });
      }
    } else if (userRole === 'pharmacist' || userRole === 'admin') {
      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID required' });
      }
      chat = await Chat.findOne({ patientId });
      if (!chat) {
        chat = new Chat({
          patientId,
          pharmacistId: userId,
          messages: [],
          status: 'active',
        });
      } else {
        chat.pharmacistId = userId;
      }
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add user message
    const userMessage = {
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      message: message,
      isBot: false,
      timestamp: new Date(),
    };

    chat.messages.push(userMessage);
    chat.lastMessageAt = new Date();

    // Update unread counts
    if (userRole === 'patient') {
      chat.unreadCount.pharmacist += 1;
    } else {
      chat.unreadCount.patient += 1;
    }

    await chat.save();

    // Auto-respond with bot if patient sends message and no pharmacist is assigned
    if (userRole === 'patient' && !chat.pharmacistId) {
      const botResponse = getBotResponse(message);
      const botMessage = {
        senderId: null,
        senderName: 'Jayathura Bot',
        senderRole: 'bot',
        message: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      chat.messages.push(botMessage);
      chat.lastMessageAt = new Date();
      await chat.save();
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userRole = req.user.role;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (userRole === 'patient') {
      chat.unreadCount.patient = 0;
    } else if (userRole === 'pharmacist' || userRole === 'admin') {
      chat.unreadCount.pharmacist = 0;
    }

    await chat.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close chat
router.put('/close/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.status = 'closed';
    await chat.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Close chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

