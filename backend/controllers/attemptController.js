const Attempt = require('../models/Attempt');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const { calculateAverageTime, calculateGrade } = require('../utils/jwt');

/**
 * Start an exam attempt
 */
exports.startAttempt = async (req, res) => {
  try {
    const { examId, accessCode } = req.body;

    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if exam is published
    if (exam.status !== 'published') {
      return res.status(403).json({ message: 'Exam is not available' });
    }

    // Check if exam is within time window
    const now = new Date();
    if (now < exam.startDate || now > exam.endDate) {
      return res.status(403).json({ message: 'Exam is not available at this time' });
    }

    // Check access code if required
    if (exam.requiresAccessCode && exam.accessCode !== accessCode) {
      return res.status(403).json({ message: 'Invalid access code' });
    }

    // Check if multiple attempts are allowed
    if (!exam.allowMultipleAttempts) {
      const previousAttempt = await Attempt.findOne({
        student: req.user._id,
        exam: examId,
        status: 'submitted',
      });

      if (previousAttempt) {
        return res.status(403).json({ message: 'You have already attempted this exam' });
      }
    }

    // Create new attempt
    const attempt = new Attempt({
      student: req.user._id,
      exam: examId,
      startTime: new Date(),
      status: 'in_progress',
      hostName: req.body.hostName,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await attempt.save();

    // Prepare exam data with questions (without answers)
    const examData = {
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      allowReview: exam.allowReview,
      questions: exam.questions.map((q) => ({
        _id: q._id,
        text: q.text,
        type: q.type,
        options: exam.randomizeOptions ? shuffleArray(q.options) : q.options,
        marks: q.marks,
        image: q.image,
      })),
    };

    // Randomize questions if needed
    if (exam.randomizeQuestions) {
      examData.questions = shuffleArray(examData.questions);
    }

    res.status(201).json({
      message: 'Attempt started',
      attempt: {
        _id: attempt._id,
        startTime: attempt.startTime,
      },
      exam: examData,
    });
  } catch (error) {
    console.error('Error starting attempt:', error);
    res.status(500).json({ message: 'Error starting attempt', error: error.message });
  }
};

/**
 * Save answer during exam
 */
exports.saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, answer } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Check if attempt belongs to user
    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check if attempt is still in progress
    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ message: 'Attempt is no longer in progress' });
    }

    // Find or create answer entry
    const answerIndex = attempt.answers.findIndex((a) => a.question.toString() === questionId);

    if (answerIndex >= 0) {
      attempt.answers[answerIndex].answer = answer;
    } else {
      attempt.answers.push({
        question: questionId,
        answer,
      });
    }

    await attempt.save();

    res.status(200).json({
      message: 'Answer saved',
      attempt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving answer' });
  }
};

/**
 * Submit exam attempt
 */
exports.submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId).populate('exam').populate({
      path: 'answers.question',
      model: 'Question',
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Check if attempt belongs to user
    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Calculate scores
    let totalMarks = 0;
    let marksObtained = 0;
    let questionsAttempted = 0;
    let questionsCorrect = 0;

    attempt.answers.forEach((answer) => {
      const question = answer.question;
      totalMarks += question.marks;

      if (answer.answer) {
        questionsAttempted++;

        // Check if answer is correct
        let isCorrect = false;

        if (question.type === 'mcq') {
          isCorrect = answer.answer === question.correctAnswer;
        } else if (question.type === 'true_false') {
          isCorrect = answer.answer === question.correctAnswer;
        } else if (question.type === 'short_answer') {
          // Simple comparison (can be enhanced with fuzzy matching)
          isCorrect =
            answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        }

        answer.isCorrect = isCorrect;
        if (isCorrect) {
          answer.marksObtained = question.marks;
          marksObtained += question.marks;
          questionsCorrect++;
        } else {
          answer.marksObtained = 0;
        }
      }
    });

    // Update attempt
    attempt.endTime = new Date();
    attempt.submittedTime = new Date();
    attempt.status = 'submitted';
    attempt.totalMarksObtained = marksObtained;
    attempt.percentage = (marksObtained / totalMarks) * 100;
    attempt.isPassed = attempt.percentage >= (attempt.exam.passingMarks / totalMarks) * 100;
    attempt.questionsAttempted = questionsAttempted;
    attempt.questionsCorrect = questionsCorrect;
    attempt.questionsWrong = questionsAttempted - questionsCorrect;
    attempt.questionsSkipped = attempt.answers.length - questionsAttempted;
    attempt.timeSpent = Math.round((attempt.endTime - attempt.startTime) / 1000);

    await attempt.save();

    // Create result
    const result = new Result({
      student: attempt.student,
      exam: attempt.exam._id,
      attempt: attempt._id,
      totalMarks,
      marksObtained,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      grade: calculateGrade(attempt.percentage),
      questionsAttempted,
      questionsCorrect,
      questionsWrong: attempt.questionsWrong,
      questionsSkipped: attempt.questionsSkipped,
      timeSpent: attempt.timeSpent,
      averageTimePerQuestion: calculateAverageTime(attempt.timeSpent, questionsAttempted),
    });

    await result.save();

    res.status(200).json({
      message: 'Attempt submitted successfully',
      result: {
        _id: result._id,
        totalMarks,
        marksObtained,
        percentage: attempt.percentage,
        isPassed: attempt.isPassed,
        grade: result.grade,
      },
    });
  } catch (error) {
    console.error('Error submitting attempt:', error);
    res.status(500).json({ message: 'Error submitting attempt', error: error.message });
  }
};

/**
 * Get attempt details
 */
exports.getAttemptDetails = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate('exam')
      .populate({
        path: 'answers.question',
        model: 'Question',
      });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Check authorization
    if (attempt.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt details' });
  }
};

/**
 * Get all attempts for a student
 */
exports.getStudentAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const attempts = await Attempt.find({ student: req.user._id })
      .populate('exam', 'title subject')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Attempt.countDocuments({ student: req.user._id });

    res.status(200).json({
      attempts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts' });
  }
};

/**
 * Auto-submit attempt (on timeout)
 */
exports.autoSubmitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ message: 'Attempt is not in progress' });
    }

    attempt.status = 'auto_submitted';
    attempt.endTime = new Date();
    attempt.submittedTime = new Date();
    await attempt.save();

    res.status(200).json({
      message: 'Attempt auto-submitted',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error auto-submitting attempt' });
  }
};

/**
 * Shuffle array for randomization
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
