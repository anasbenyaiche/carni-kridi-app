const express = require('express');
const { body, validationResult } = require('express-validator');
const KridiEntry = require('../models/KridiEntry');
const Client = require('../models/Client');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get kridi entries for a client
router.get('/client/:clientId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { clientId } = req.params;

    // Verify client belongs to user's store
    const client = await Client.findById(clientId);
    if (!client || client.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const entries = await KridiEntry.find({ clientId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name');

    const total = await KridiEntry.countDocuments({ clientId });

    res.json({
      entries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get kridi entries error:', error);
    res.status(500).json({ error: 'Failed to get kridi entries' });
  }
});

// Add new kridi entry
router.post('/', auth, authorize('attara', 'worker'), [
  body('clientId').isMongoId().withMessage('Valid client ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('reason').trim().isLength({ min: 3 }).withMessage('Reason must be at least 3 characters'),
  body('type').isIn(['debt', 'payment']).withMessage('Type must be debt or payment'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, amount, reason, type } = req.body;

    // Verify client belongs to user's store
    const client = await Client.findById(clientId);
    if (!client || client.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const entry = new KridiEntry({
      clientId,
      storeId: req.user.storeId,
      amount,
      reason,
      type,
      createdBy: req.user._id,
    });

    await entry.save();
    await entry.populate('createdBy', 'name');

    // Update client's last transaction
    client.lastTransaction = new Date();
    await client.save();

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create kridi entry error:', error);
    res.status(500).json({ error: 'Failed to create kridi entry' });
  }
});

// Update kridi entry (mark payment)
router.put('/:id/payment', auth, authorize('attara', 'worker'), [
  body('paidAmount').isFloat({ min: 0.01 }).withMessage('Paid amount must be greater than 0'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paidAmount } = req.body;
    const entry = await KridiEntry.findById(req.params.id);

    if (!entry || entry.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    if (entry.type !== 'debt') {
      return res.status(400).json({ error: 'Can only mark debt entries as paid' });
    }

    const newPaidAmount = entry.paidAmount + paidAmount;
    if (newPaidAmount > entry.amount) {
      return res.status(400).json({ error: 'Paid amount exceeds debt amount' });
    }

    entry.paidAmount = newPaidAmount;
    await entry.save();

    res.json(entry);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Get store summary
router.get('/summary', auth, async (req, res) => {
  try {
    const storeId = req.user.storeId;

    const summary = await KridiEntry.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          remaining: { $sum: '$remainingAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const clientCount = await Client.countDocuments({ storeId });
    const activeClients = await Client.countDocuments({ 
      storeId, 
      lastTransaction: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });

    res.json({
      summary,
      clientCount,
      activeClients,
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

// Delete kridi entry
router.delete('/:id', auth, authorize('attara'), async (req, res) => {
  try {
    const entry = await KridiEntry.findById(req.params.id);
    if (!entry || entry.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await KridiEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;