// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const User = require('../models/User');
const Product = require('../models/Product');

// Route untuk mendapatkan laporan penjualan
router.get('/api/sales', async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('userId', 'userId email') // Mengambil data userId dan email dari model User
            .exec();

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales data available' });
        }

        // Untuk setiap sale, dapatkan data produk
        const salesWithProductDetails = await Promise.all(sales.map(async (sale) => {
            const product = await Product.findOne({ kode: sale.productCode }).exec();
            return {
                userId: sale.userId.userId,
                email: sale.userId.email,
                productCode: sale.productCode,
                productName: product ? product.nama : 'Unknown',
                price: sale.price,
                quantity: sale.quantity
            };
        }));

        res.json(salesWithProductDetails);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ message: 'Error fetching sales data' });
    }
});

module.exports = router;
