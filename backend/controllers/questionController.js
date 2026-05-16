const Question = require('../models/Question');

/**
 * Create a new question
 */
exports.createQuestion = async (req, res) => {
  try {
    const { text, type, options, correctAnswer, explanation, marks, difficulty, tags } =
      req.body;

    const question = new Question({
      text,
      type,
      options,
      correctAnswer,
      explanation,
      marks,
      difficulty,
      tags,
      createdBy: req.user._id,
    });

    await question.save();
    res.status(201).json({
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

/**
 * Get all questions
 */
exports.getQuestions = async (req, res) => {
  try {
    const { type, difficulty, search, page = 1, limit = 20 } = req.query;

    let query = { createdBy: req.user._id };
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.text = new RegExp(search, 'i');

    const skip = (page - 1) * limit;
    const questions = await Question.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Question.countDocuments(query);

    res.status(200).json({
      questions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

/**
 * Get question by ID
 */
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is creator or admin
    if (question.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question' });
  }
};

/**
 * Update question
 */
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check authorization
    if (question.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(question, req.body);
    await question.save();

    res.status(200).json({
      message: 'Question updated successfully',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating question' });
  }
};

/**
 * Delete question
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check authorization
    if (question.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Question deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question' });
  }
};

/**
 * Bulk upload questions (CSV/JSON)
 */
exports.bulkUploadQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        ...q,
        createdBy: req.user._id,
      }))
    );

    res.status(201).json({
      message: `${createdQuestions.length} questions uploaded successfully`,
      questions: createdQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading questions', error: error.message });
  }
};
