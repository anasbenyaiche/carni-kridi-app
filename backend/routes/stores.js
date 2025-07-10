const express = require('express');
const { body, validationResult } = require('express-validator');
const Store = require('../models/Store');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get store info
router.get('/', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId).populate('ownerId', 'name email');
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Failed to get store' });
  }
});

// Create new store
router.post('/', auth, authorize('admin', 'attara'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('phone').trim().isLength({ min: 8 }).withMessage('Phone must be at least 8 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, phone, settings } = req.body;

    const store = new Store({
      name,
      address,
      phone,
      ownerId: req.user._id,
      settings,
    });

    await store.save();
    res.status(201).json(store);
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
});

// Update store
router.put('/', auth, authorize('attara'), async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { name, address, phone, settings } = req.body;

    Object.assign(store, {
      name: name || store.name,
      address: address || store.address,
      phone: phone || store.phone,
      settings: { ...store.settings, ...settings },
    });

    await store.save();
    res.json(store);
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Failed to update store' });
  }
});

module.exports = router;