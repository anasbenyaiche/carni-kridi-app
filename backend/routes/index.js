const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Carni Kridi Attar API is running.' });
});

// Import and use other route modules
router.use('/clients', require('./clients'));
router.use('/kridi', require('./kridi'));
router.use('/stores', require('./stores'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
// Add other routes as needed

module.exports = router;