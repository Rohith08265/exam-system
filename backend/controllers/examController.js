const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { generateAccessCode } = require('../utils/jwt');
const { sendExamScheduledEmail } = require('../utils/email');

/**
 * Create a new exam
 */
exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingMarks,
      randomizeQuestions,
      randomizeOptions,
      showCorrectAnswers,
      allowReview,
      allowMultipleAttempts,
      maxAttempts,
      resultVisibility,
      resultRevealDate,
      startDate,
      endDate,
      requiresAccessCode,
    } = req.body;

    let accessCode = null;
    if (requiresAccessCode) {
      accessCode = generateAccessCode();
    }

    const exam = new Exam({
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingMarks,
      randomizeQuestions,
      randomizeOptions,
      showCorrectAnswers,
      allowReview,
      allowMultipleAttempts,
      maxAttempts,
      resultVisibility,
      resultRevealDate,
      startDate,
      endDate,
      accessCode,
      requiresAccessCode,
      createdBy: req.user._id,
    });

    await exam.save();

    res.status(201).json({
      message: 'Exam created successfully',
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

/**
 * Get all exams
 */
exports.getExams = async (req, res) => {
  try {
    const { status, subject, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (search) query.title = new RegExp(search, 'i');

    // Students can only see published exams
    if (req.user.role === 'student') {
      query.status = 'published';
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }
    // Teachers can only see their exams
    else if (req.user.role === 'teacher') {
      query.createdBy = req.user._id;
    }

    const skip = (page - 1) * limit;
    const exams = await Exam.find(query)
      .populate('questions', '_id')
      .populate('createdBy', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-startDate');

    const total = await Exam.countDocuments(query);

    res.status(200).json({
      exams,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams' });
  }
};

/**
 * Get exam by ID
 */
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('questions')
      .populate('createdBy', 'firstName lastName email');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if student has access
    if (req.user.role === 'student') {
      if (exam.status !== 'published') {
        return res.status(403).json({ message: 'Exam not available' });
      }
    }

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam' });
  }
};

/**
 * Update exam
 */
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check authorization
    if (exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(exam, req.body);
    await exam.save();

    res.status(200).json({
      message: 'Exam updated successfully',
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam' });
  }
};

/**
 * Add questions to exam
 */
exports.addQuestionsToExam = async (req, res) => {
  try {
    const { questionIds } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check authorization
    if (exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    exam.questions = [...new Set([...exam.questions, ...questionIds])];
    await exam.save();

    res.status(200).json({
      message: 'Questions added to exam',
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding questions' });
  }
};

/**
 * Remove question from exam
 */
exports.removeQuestionFromExam = async (req, res) => {
  try {
    const { questionId } = req.body;

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    exam.questions = exam.questions.filter((qId) => qId.toString() !== questionId);
    await exam.save();

    res.status(200).json({
      message: 'Question removed from exam',
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing question' });
  }
};

/**
 * Publish exam
 */
exports.publishExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check authorization
    if (exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (exam.questions.length === 0) {
      return res.status(400).json({ message: 'Exam must have questions' });
    }

    exam.status = 'published';
    await exam.save();

    res.status(200).json({
      message: 'Exam published successfully',
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing exam' });
  }
};

/**
 * Enroll students in exam
 */
exports.enrollStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'Student IDs array is required' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check authorization
    if (exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    exam.enrolledStudents = [...new Set([...exam.enrolledStudents, ...studentIds])];
    await exam.save();

    res.status(200).json({
      message: 'Students enrolled successfully',
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling students' });
  }
};

/**
 * Delete exam
 */
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check authorization
    if (exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Exam.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam' });
  }
};
