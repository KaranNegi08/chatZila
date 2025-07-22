const express = require('express');
const Message = require('../models/Message');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

const router = express.Router();

// Get messages for a room
router.get('/:roomId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is a member
    const isMember = room.members.some(member => 
      member.user.toString() === req.user._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this room' });
    }

    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/:roomId', auth, async (req, res) => {
  try {
    const { content, type = 'text', replyTo } = req.body;
    
    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is a member
    const isMember = room.members.some(member => 
      member.user.toString() === req.user._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this room' });
    }

    const message = new Message({
      content: content.trim(),
      type,
      sender: req.user._id,
      room: req.params.roomId,
      replyTo: replyTo || undefined
    });

    await message.save();
    await message.populate('sender', 'username avatar');
    
    if (replyTo) {
      await message.populate('replyTo', 'content sender');
    }

    // Update room's last activity
    room.updatedAt = new Date();
    await room.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add reaction to message
router.post('/:messageId/reaction', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      reaction => reaction.user.toString() === req.user._id.toString() && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        reaction => !(reaction.user.toString() === req.user._id.toString() && reaction.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        user: req.user._id,
        emoji
      });
    }

    await message.save();
    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;