const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint to get user count
router.get('/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    console.error('Error retrieving user count:', error);
    res.status(500).json({ error: 'Error retrieving user count' });
  }
});

module.exports = router;