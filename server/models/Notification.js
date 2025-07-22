const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['room_invitation', 'join_request', 'message_mention', 'room_update'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    invitationId: String,
    requestId: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  actionTaken: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'none'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better performance
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);