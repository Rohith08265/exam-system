const router = require('express').Router();
const attemptController = require('../controllers/attemptController');
const { verifyToken } = require('../middleware/auth');

/**
 * Start exam attempt
 */
router.post('/start', verifyToken, attemptController.startAttempt);

/**
 * Save answer during exam
 */
router.post('/:attemptId/answer', verifyToken, attemptController.saveAnswer);

/**
 * Submit exam attempt
 */
router.post('/:attemptId/submit', verifyToken, attemptController.submitAttempt);

/**
 * Auto-submit attempt (timeout)
 */
router.post('/:attemptId/auto-submit', verifyToken, attemptController.autoSubmitAttempt);

/**
 * Get attempt details
 */
router.get('/:attemptId', verifyToken, attemptController.getAttemptDetails);

/**
 * Get student's attempts
 */
router.get('/student/all', verifyToken, attemptController.getStudentAttempts);

module.exports = router;
