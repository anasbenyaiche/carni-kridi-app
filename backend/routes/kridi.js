const express = require('express');
const { body } = require('express-validator');
const kridiController = require('../controllers/kridiController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get kridi entries for a client
router.get('/client/:clientId', auth, kridiController.getKridiEntriesByClient.bind(kridiController));

// Add new kridi entry
router.post('/', auth, authorize('attara', 'worker'), [
  body('clientId').isMongoId().withMessage('Valid client ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('reason').trim().isLength({ min: 3 }).withMessage('Reason must be at least 3 characters'),
  body('type').isIn(['debt', 'payment']).withMessage('Type must be debt or payment'),
], kridiController.createKridiEntry.bind(kridiController));

// Update kridi entry (mark payment)
router.put('/:id/payment', auth, authorize('attara', 'worker'), [
  body('paidAmount').isFloat({ min: 0.01 }).withMessage('Paid amount must be greater than 0'),
], kridiController.markPayment.bind(kridiController));

// Get store summary
router.get('/summary', auth, kridiController.getSummary.bind(kridiController));

// Delete kridi entry
router.delete('/:id', auth, authorize('attara'), kridiController.deleteEntry.bind(kridiController));

module.exports = router;