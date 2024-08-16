// models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productCode: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

module.exports = Sale;
