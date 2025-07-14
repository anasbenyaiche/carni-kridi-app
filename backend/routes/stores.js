const express = require('express');
const { body } = require('express-validator');
const storeController = require('../controllers/storeController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get store info
router.get('/', auth, storeController.getStore.bind(storeController));

// Create new store
router.post('/', auth, authorize('admin', 'attara'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('phone').trim().isLength({ min: 8 }).withMessage('Phone must be at least 8 characters'),
], storeController.createStore.bind(storeController));

// Update store
router.put('/', auth, authorize('attara'), storeController.updateStore.bind(storeController));

module.exports = router;