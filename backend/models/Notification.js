const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['exam', 'result', 'system', 'announcement'],
      default: 'system',
    },
    relatedExam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
    relatedResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Result',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    actionUrl: String,
  },
  { timestamps: true, indexes: [{ recipient: 1 }, { isRead: 1 }, { createdAt: -1 }] }
);

module.exports = mongoose.model('Notification', notificationSchema);
