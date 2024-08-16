// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    kode: { type: String, required: true, unique: true },
    harga: { type: Number, required: true },
    deskripsi: { type: String, required: true },
    stock: { type: Number, default: 0 },
    terjual: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false } // Field untuk soft delete
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
