const router = require('express').Router();
const questionController = require('../controllers/questionController');
const { verifyToken, checkRole, checkPermission } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { questionSchema } = require('../validators/schemas');

/**
 * Create question (protected)
 */
router.post(
  '/',
  verifyToken,
  checkRole(['teacher', 'admin']),
  validateRequest(questionSchema),
  questionController.createQuestion
);

/**
 * Get questions (protected)
 */
router.get('/', verifyToken, checkRole(['teacher', 'admin']), questionController.getQuestions);

/**
 * Get question by ID (protected)
 */
router.get('/:id', verifyToken, questionController.getQuestionById);

/**
 * Update question
 */
router.put('/:id', verifyToken, checkRole(['teacher', 'admin']), questionController.updateQuestion);

/**
 * Delete question
 */
router.delete(
  '/:id',
  verifyToken,
  checkRole(['teacher', 'admin']),
  questionController.deleteQuestion
);

/**
 * Bulk upload questions
 */
router.post(
  '/bulk/upload',
  verifyToken,
  checkRole(['teacher', 'admin']),
  questionController.bulkUploadQuestions
);

module.exports = router;
