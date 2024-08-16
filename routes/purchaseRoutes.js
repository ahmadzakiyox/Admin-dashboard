const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase'); // Pastikan jalur model sesuai

// Endpoint untuk mendapatkan semua pembelian
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Error fetching purchases' });
  }
});

module.exports = router;