const mongoose = require('mongoose');

// Definisi skema untuk stok
const stockSchema = new mongoose.Schema({
  kode: {
    type: String,
    required: true,
    index: true // Indexing jika sering mencari berdasarkan kode
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v); // Validasi format email
      },
      message: props => `${props.value} bukan email yang valid!`
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
})

// Membuat model stok
const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
