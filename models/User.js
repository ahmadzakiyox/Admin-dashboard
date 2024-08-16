// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    // Tambahkan field lain jika diperlukan
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
