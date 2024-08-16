const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const Product = require('../models/product');
const Stock = require('../models/stock'); // Pastikan Anda memuat model Stock

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Endpoint untuk menambah stok masal dari file TXT
router.post('/txt', upload.single('fileUpload'), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Baca data dari file TXT
    const data = fs.readFileSync(filePath, 'utf8');
    const entries = data.split('\n').map(line => line.trim());

    for (const entry of entries) {
      // Pisahkan data berdasarkan koma
      const [kode, email, username, password] = entry.split(',');

      // Validasi data
      if (!kode || !email || !username || !password) {
        console.log(`Data tidak lengkap: ${entry}`);
        continue; // Skip to the next entry
      }

      // Cari produk berdasarkan kode
      const product = await Product.findOne({ kode });
      if (!product) {
        console.log(`Produk tidak ditemukan: ${kode}`);
        continue; // Skip to the next product
      }

      // Tambahkan stock
      product.stock += 1; // Menambahkan stock 1, sesuaikan jika diperlukan

      // Simpan data stock tambahan
      const newStock = new Stock({ kode, email, username, password, twoFactorAuth: '' });
      await newStock.save();

      // Simpan perubahan produk
      await product.save();
    }

    // Hapus file setelah selesai
    fs.unlinkSync(filePath);
    
    // Kirim respons sukses
    res.json({ message: 'Stok berhasil ditambahkan untuk semua produk.' });
  } catch (error) {
    console.error('Error adding stock from TXT:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan stok.' });
  }
});

// Endpoint untuk menambah stok produk
router.post('/add', async (req, res) => {
  const { kodeProduk, email, password } = req.body; // Hanya menerima email dan password

  try {
    // Verifikasi apakah produk ada di database
    const product = await Product.findOne({ kode: kodeProduk });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Simpan data stok tambahan
    const newStock = new Stock({ kode: kodeProduk, email, password });
    await newStock.save();

    // Update stok produk
    product.stock += 1;
    await product.save();

    res.json({ message: 'Stock added successfully', product });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ message: 'Error adding stock' });
  }
});

module.exports = router;
