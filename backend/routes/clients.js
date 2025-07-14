const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const clientController = require('../controllers/clientController');

const router = express.Router();

router.get('/', auth, clientController.getClients);
router.get('/:id', auth, clientController.getClientById);

router.post(
  '/',
  auth,
  authorize('attara', 'worker'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').trim().isLength({ min: 8 }).withMessage('Phone must be at least 8 characters'),
  ],
  clientController.createClient
);

router.put('/:id', auth, authorize('attara', 'worker'), clientController.updateClient);
router.delete('/:id', auth, authorize('attara'), clientController.deleteClient);

module.exports = router;