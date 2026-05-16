const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
    },
    type: {
      type: String,
      enum: ['mcq', 'true_false', 'short_answer'],
      required: [true, 'Question type is required'],
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    correctAnswer: String, // For true/false and short answer
    explanation: String,
    marks: {
      type: Number,
      default: 1,
      min: 0.5,
      max: 10,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: [String],
    image: String, // URL to question image
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, indexes: [{ createdBy: 1 }, { type: 1 }, { tags: 1 }] }
);

module.exports = mongoose.model('Question', questionSchema);
