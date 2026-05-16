const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    submittedTime: Date,
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'auto_submitted'],
      default: 'in_progress',
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        answer: String,
        isCorrect: Boolean,
        marksObtained: Number,
      },
    ],
    totalMarksObtained: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    timeSpent: Number, // in seconds
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    questionsCorrect: {
      type: Number,
      default: 0,
    },
    questionsWrong: {
      type: Number,
      default: 0,
    },
    questionsSkipped: {
      type: Number,
      default: 0,
    },
    cheatingDetected: {
      type: Boolean,
      default: false,
    },
    cheatingReports: [String],
    hostName: String, // User's device host name
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
    indexes: [
      { student: 1, exam: 1 },
      { exam: 1 },
      { status: 1 },
      { createdAt: -1 },
    ],
  }
);

module.exports = mongoose.model('Attempt', attemptSchema);
