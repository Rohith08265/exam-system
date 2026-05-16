const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
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
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attempt',
      required: true,
    },
    totalMarks: Number,
    marksObtained: Number,
    percentage: Number,
    isPassed: Boolean,
    grade: String, // A, B, C, D, F
    rank: Number, // Rank in the exam
    questionsAttempted: Number,
    questionsCorrect: Number,
    questionsWrong: Number,
    questionsSkipped: Number,
    answerDetails: [
      {
        question: mongoose.Schema.Types.ObjectId,
        questionText: String,
        studentAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        marksObtained: Number,
        explanation: String,
      },
    ],
    timeSpent: Number, // in seconds
    averageTimePerQuestion: Number, // in seconds
    resultGeneratedAt: {
      type: Date,
      default: Date.now,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    reviewedBy: mongoose.Schema.Types.ObjectId, // Teacher who reviewed
    reviewedAt: Date,
    reviewComments: String,
  },
  {
    timestamps: true,
    indexes: [
      { student: 1, exam: 1 },
      { exam: 1 },
      { rank: 1 },
      { createdAt: -1 },
    ],
  }
);

module.exports = mongoose.model('Result', resultSchema);
