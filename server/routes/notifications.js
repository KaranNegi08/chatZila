const express = require('express');
const Notification = require('../models/Notification');
const Room = require('../models/Room');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// ✅ Get notifications (with pagination, unreadOnly filter)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { recipient: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'username avatar')
      .populate('data.roomId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Mark a specific notification as read
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.notificationId,
        recipient: req.user._id
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Handle invitation response (accept or decline)
router.post('/:notificationId/respond', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const notification = await Notification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // ✅ Accepting room invitation
    if (notification.type === 'room_invitation' && action === 'accept') {
      const room = await Room.findById(notification.data.roomId);

      if (room) {
        const isAlreadyMember = room.members.some(member =>
          member.user.toString() === req.user._id.toString()
        );

        if (!isAlreadyMember) {
          room.members.push({
            user: req.user._id,
            role: 'member'
          });
          await room.save();

          await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { joinedRooms: room._id }
          });
        }
      }
    }

    // ✅ Update notification status
    notification.actionTaken = action === 'accept' ? 'accepted' : 'declined';
    notification.isRead = true;
    await notification.save();

    res.json({ message: `Invitation ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
