const mongoose = require('mongoose');

// URL koneksi ke MongoDB, ganti dengan URL database MongoDB Anda
const dbURI = 'mongodb+srv://nuxysapi:lelang18@cluster0.cmvqrmm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // atau URL database MongoDB Atlas Anda

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB terkoneksi dengan sukses');
  } catch (error) {
    console.error('Gagal terkoneksi ke MongoDB:', error.message);
    process.exit(1); // Keluar dari aplikasi jika koneksi gagal
  }
};

module.exports = connectDB;