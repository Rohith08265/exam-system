const router = require('express').Router();
const resultController = require('../controllers/resultController');
const { verifyToken, checkRole } = require('../middleware/auth');

/**
 * Get result by ID
 */
router.get('/:resultId', verifyToken, resultController.getResultById);

/**
 * Get student's results
 */
router.get('/student/all', verifyToken, resultController.getStudentResults);

/**
 * Get exam results (teacher/admin)
 */
router.get('/exam/:examId/results', verifyToken, checkRole(['teacher', 'admin']), resultController.getExamResults);

/**
 * Get exam leaderboard
 */
router.get('/exam/:examId/leaderboard', verifyToken, resultController.getExamLeaderboard);

/**
 * Get exam analytics
 */
router.get('/exam/:examId/analytics', verifyToken, checkRole(['teacher', 'admin']), resultController.getExamAnalytics);

/**
 * Export results as CSV
 */
router.get(
  '/exam/:examId/export-csv',
  verifyToken,
  checkRole(['teacher', 'admin']),
  resultController.exportResultsAsCSV
);

module.exports = router;
