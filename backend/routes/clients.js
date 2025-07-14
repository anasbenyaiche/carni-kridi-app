const express = require('express');
const { body } = require('express-validator');
const clientController = require('../controllers/clientController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all clients for a store
router.get('/', auth, clientController.getClients.bind(clientController));

// Get single client with summary
router.get('/:id', auth, clientController.getClient.bind(clientController));

// Create new client
router.post('/', auth, authorize('attara', 'worker'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').trim().isLength({ min: 8 }).withMessage('Phone must be at least 8 characters'),
], clientController.createClient.bind(clientController));

// Update client
router.put('/:id', auth, authorize('attara', 'worker'), clientController.updateClient.bind(clientController));

// Delete client
router.delete('/:id', auth, authorize('attara'), clientController.deleteClient.bind(clientController));

module.exports = router;