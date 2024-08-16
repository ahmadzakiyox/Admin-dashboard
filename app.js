const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Product = require('./models/Product');  // Pastikan import model
const Purchase= require('./models/Purchase');  // Pastikan import model

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.render('index'); // Render the main EJS page
});

// Endpoint untuk mendapatkan total pendapatan
app.get('/api/sales/total', async (req, res) => {
  try {
      const totalSales = await Product.aggregate([
          { $group: { _id: null, total: { $sum: { $multiply: ["$harga", "$terjual"] } } } }
      ]);

      res.json({ total: totalSales[0] ? totalSales[0].total : 0 });
  } catch (error) {
      console.error('Error fetching total sales:', error);
      res.status(500).json({ error: 'Error fetching total sales' });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://murafulan:lelang18@cluster0.qblcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const reportRoutes = require('./routes/reportRouters'); // Import report routes
const depositRoutes = require('./routes/depositRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes'); 
const salesRoutes = require('./routes/salesRoutes');

// Endpoints
app.get('/api/products/sold', async (req, res) => {
  try {
      const products = await Product.find();
      const totalSold = products.reduce((sum, product) => sum + product.terjual, 0);
      res.json({ sold: totalSold });
  } catch (error) {
      console.error('Error fetching sold products:', error);
      res.status(500).json({ message: 'Error fetching data' });
  }
});

// Endpoint untuk mendapatkan data pembelian
app.get('/api/purchases', async (req, res) => {
  try {
      const purchases = await Product.find();
      res.json(purchases);
  } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).json({ message: 'Error fetching purchases' });
  }
});

// Route to display data
app.get('/report', async (req, res) => {
  try {
    const purchases = await Purchase.find({});
    res.render('report', { purchases });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Mount the router
app.use('/api/products', productRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/users', userRoutes); // Use user routes
app.use('/api', reportRoutes); // Use report routes
app.use('/api/deposit', depositRoutes);  // Use deposit routes
app.use('/api', depositRoutes);
app.use('/api/purchases', purchaseRoutes); // Tambahkan ini
app.use('/api/sales', salesRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

