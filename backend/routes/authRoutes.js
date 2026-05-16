const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { registerSchema, loginSchema } = require('../validators/schemas');

/**
 * Public auth routes
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login
);

router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

/**
 * Protected auth routes
 */
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
