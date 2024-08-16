const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Tambah produk
router.post('/', async (req, res) => {
  try {
    const { nama, kode, harga, deskripsi } = req.body;
    if (!nama || !kode || !harga || !deskripsi) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({ nama, kode, harga, deskripsi });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Daftar produk
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT route to update the price of a product
router.put('/:kode', async (req, res) => {
  try {
      const { kode } = req.params;
      const { harga } = req.body;

      if (!harga) {
          return res.status(400).json({ message: 'Price is required' });
      }

      const updatedProduct = await Product.findOneAndUpdate(
          { kode },
          { harga },
          { new: true }
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json(updatedProduct);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route to delete a product
router.delete('/:kode', async (req, res) => {
  try {
      const { kode } = req.params;

      const deletedProduct = await Product.findOneAndDelete({ kode });

      if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint untuk mendapatkan jumlah produk
router.get('/count', async (req, res) => {
  try {
      const count = await Product.countDocuments({});
      res.json({ count });
  } catch (error) {
      res.status(500).json({ error: 'Error fetching product count' });
  }
});

// Soft delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product soft deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Add stock to a product
router.post('/add', async (req, res) => {
  const { kodeProduk, email, password } = req.body;

  //Validate email and password if necessary
  //Assuming you have some logic for authentication
  if (!authenticateUser(email, password)) {
    return res.status(403).json({ message: 'Invalid credentials' });
   }

  try {
    // Find the product by kodeProduk
    const product = await Product.findOne({ kode: kodeProduk });
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

// Route untuk mendapatkan semua produk
router.get('/api/products', async (req, res) => {
  try {
      const products = await Product.find({ isDeleted: false }); // Hanya ambil produk yang tidak dihapus
      res.json(products);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
  }
});

console.log('Before update:', product);
product.stock += 1;
await product.save();
console.log('After update:', product);

    res.json({ message: 'Stock updated successfully', product });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Error updating stock' });
  }
});

module.exports = router;
