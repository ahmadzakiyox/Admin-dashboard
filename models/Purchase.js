const mongoose = require('mongoose');
const Product = require('./Product'); // Sesuaikan jalur model jika perlu

const purchaseSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  kode: { type: String, required: true },
  nama: { type: String, required: true },
  harga: { type: Number, required: true },
  jumlah: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Cek apakah model sudah ada, jika belum buat model baru
const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;