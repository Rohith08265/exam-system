const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

/**
 * Get own profile (protected)
 */
router.get('/profile', verifyToken, userController.getProfile);

/**
 * Update own profile (protected)
 */
router.put('/profile', verifyToken, userController.updateProfile);

/**
 * Admin routes
 */
router.get('/', verifyToken, checkRole(['admin']), userController.getAllUsers);
router.get('/:id', verifyToken, checkRole(['admin']), userController.getUserById);
router.put('/:id/role', verifyToken, checkRole(['admin']), userController.updateUserRole);
router.put('/:id/deactivate', verifyToken, checkRole(['admin']), userController.deactivateUser);
router.put('/:id/activate', verifyToken, checkRole(['admin']), userController.activateUser);
router.delete('/:id', verifyToken, checkRole(['admin']), userController.deleteUser);

module.exports = router;
