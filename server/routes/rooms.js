const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all rooms user is member of
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      'members.user': req.user._id
    }).populate('createdBy', 'username avatar')
      .populate('members.user', 'username avatar bio')
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all available rooms (for join requests)
router.get('/available', auth, async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {
      'members.user': { $ne: req.user._id },
      isPrivate: false
    };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const rooms = await Room.find(query)
      .populate('createdBy', 'username avatar')
      .select('name description createdBy members createdAt')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create room
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    const room = new Room({
      name: name.trim(),
      description: description?.trim() || '',
      createdBy: req.user._id,
      isPrivate: isPrivate || false,
      members: [{
        user: req.user._id,
        role: 'owner'
      }]
    });

    await room.save();
    await room.populate('createdBy', 'username avatar');
    await room.populate('members.user', 'username avatar bio');

    // Add room to user's joined rooms
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedRooms: room._id }
    });

    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send join request
router.post('/:roomId/join-request', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate('createdBy');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is already a member
    const isMember = room.members.some(member => 
      member.user.toString() === req.user._id.toString()
    );
    
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this room' });
    }

    // Check if request already exists
    const existingNotification = await Notification.findOne({
      recipient: room.createdBy._id,
      sender: req.user._id,
      type: 'join_request',
      'data.roomId': room._id,
      actionTaken: 'pending'
    });

    if (existingNotification) {
      return res.status(400).json({ message: 'Join request already sent' });
    }

    // Create notification for room owner
    const notification = new Notification({
      recipient: room.createdBy._id,
      sender: req.user._id,
      type: 'join_request',
      title: 'New Join Request',
      message: `${req.user.username} wants to join "${room.name}"`,
      data: {
        roomId: room._id
      }
    });

    await notification.save();

    res.json({ message: 'Join request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Handle join request (accept/decline)
router.post('/join-request/:notificationId/:action', auth, async (req, res) => {
  try {
    const { notificationId, action } = req.params;
    
    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const notification = await Notification.findById(notificationId)
      .populate('sender', 'username')
      .populate('data.roomId');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const room = await Room.findById(notification.data.roomId);
    
    if (action === 'accept') {
      // Add user to room
      room.members.push({
        user: notification.sender._id,
        role: 'member'
      });
      await room.save();

      // Add room to user's joined rooms
      await User.findByIdAndUpdate(notification.sender._id, {
        $addToSet: { joinedRooms: room._id }
      });
    }

    // Update notification
    notification.actionTaken = action === 'accept' ? 'accepted' : 'declined';
    await notification.save();

    res.json({ message: `Join request ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Invite user to room
router.post('/:roomId/invite', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is room member
    const isMember = room.members.some(member => 
      member.user.toString() === req.user._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this room' });
    }

    // Find user to invite
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const isAlreadyMember = room.members.some(member => 
      member.user.toString() === userToInvite._id.toString()
    );
    
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Check if invitation already exists
    const existingNotification = await Notification.findOne({
      recipient: userToInvite._id,
      sender: req.user._id,
      type: 'room_invitation',
      'data.roomId': room._id,
      actionTaken: 'pending'
    });

    if (existingNotification) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    // Create notification
    const notification = new Notification({
      recipient: userToInvite._id,
      sender: req.user._id,
      type: 'room_invitation',
      title: 'Room Invitation',
      message: `${req.user.username} invited you to join "${room.name}"`,
      data: {
        roomId: room._id
      }
    });

    await notification.save();

    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get room members
router.get('/:roomId/members', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('members.user', 'username avatar bio isOnline lastSeen');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is a member
    const isMember = room.members.some(member => 
      member.user._id.toString() === req.user._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this room' });
    }

    res.json(room.members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;