const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Pastikan path ini sesuai dengan lokasi model User Anda

// Route untuk menambah deposit
router.post('/deposit', async (req, res) => {
    const { userId, amount } = req.body;

    console.log('Received userId:', userId, 'Received amount:', amount);

    // Validasi input
    if (!userId || !amount || isNaN(userId) || isNaN(amount) || amount <= 0) {
        console.error('Invalid input:', req.body);
        return res.status(400).json({ success: false, message: 'Invalid input. Please ensure userId and amount are valid numbers.' });
    }

    try {
        let user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: `User with ID ${userId} not found.` });
        }

        user.saldo += parseFloat(amount);
        await user.save();

        res.json({ success: true, message: `Deposit of ${amount} added to user with ID ${userId}. New balance: ${user.saldo}.` });
    } catch (error) {
        console.error('Error adding deposit:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;
