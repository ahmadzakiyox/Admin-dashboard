const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');  // Import model Purchase
const { Parser } = require('json2csv');
const XLSX = require('xlsx');

// Endpoint untuk mendapatkan laporan penjualan
router.get('/report', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const purchases = await Purchase.find()
            .skip(skip)
            .limit(limit)
            .populate('userId', 'telegramUsername'); // Pastikan field ini sesuai dengan schema

        const totalPurchases = await Purchase.countDocuments();
        const totalPages = Math.ceil(totalPurchases / limit);

        res.json({
            items: purchases,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ error: 'Error fetching report data' });
    }
});

// Endpoint untuk mengunduh laporan dalam format CSV
router.get('/report/csv', async (req, res) => {
    try {
        const purchases = await Purchase.find(); // Ambil semua data pembelian
        const fields = ['itemCode', 'itemName', 'price', 'quantity', 'telegramUsername'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(purchases);

        res.header('Content-Type', 'text/csv');
        res.attachment('report.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error generating CSV report:', error);
        res.status(500).json({ error: 'Error generating CSV report' });
    }
});

// Endpoint untuk mengunduh laporan dalam format XLSX
router.get('/report/xlsx', async (req, res) => {
    try {
        const purchases = await Purchase.find(); // Ambil semua data pembelian
        const ws = XLSX.utils.json_to_sheet(purchases.map(p => ({
            'Item Code': p.itemCode,
            'Item Name': p.itemName,
            'Price': p.price,
            'Quantity': p.quantity,
            'Telegram Username': p.telegramUsername
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('report.xlsx');
        res.send(xlsxData);
    } catch (error) {
        console.error('Error generating XLSX report:', error);
        res.status(500).json({ error: 'Error generating XLSX report' });
    }
});

module.exports = router;
