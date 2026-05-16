const router = require('express').Router();
const examController = require('../controllers/examController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { examSchema } = require('../validators/schemas');

/**
 * Create exam (teacher/admin only)
 */
router.post(
  '/',
  verifyToken,
  checkRole(['teacher', 'admin']),
  validateRequest(examSchema),
  examController.createExam
);

/**
 * Get exams
 */
router.get('/', verifyToken, examController.getExams);

/**
 * Get exam by ID
 */
router.get('/:id', verifyToken, examController.getExamById);

/**
 * Update exam (teacher/admin only)
 */
router.put('/:id', verifyToken, checkRole(['teacher', 'admin']), examController.updateExam);

/**
 * Add questions to exam
 */
router.post(
  '/:id/questions',
  verifyToken,
  checkRole(['teacher', 'admin']),
  examController.addQuestionsToExam
);

/**
 * Remove question from exam
 */
router.delete(
  '/:id/questions/:questionId',
  verifyToken,
  checkRole(['teacher', 'admin']),
  examController.removeQuestionFromExam
);

/**
 * Publish exam
 */
router.post(
  '/:id/publish',
  verifyToken,
  checkRole(['teacher', 'admin']),
  examController.publishExam
);

/**
 * Enroll students
 */
router.post(
  '/:id/enroll',
  verifyToken,
  checkRole(['teacher', 'admin']),
  examController.enrollStudents
);

/**
 * Delete exam
 */
router.delete('/:id', verifyToken, checkRole(['teacher', 'admin']), examController.deleteExam);

module.exports = router;
