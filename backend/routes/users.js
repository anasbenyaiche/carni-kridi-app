const express = require('express');
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get store users
router.get('/', auth, authorize('attara'), userController.getUsers.bind(userController));

// Update user role
router.put('/:id/role', auth, authorize('attara'), userController.updateUserRole.bind(userController));

module.exports = router;