const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get store users
router.get('/', auth, authorize('attara'), async (req, res) => {
  try {
    const users = await User.find({ storeId: req.user.storeId })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Update user role
router.put('/:id/role', auth, authorize('attara'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['worker', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;