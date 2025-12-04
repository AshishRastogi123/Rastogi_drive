const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, "Username must be at least 3 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [13, "Email must be at least 13 characters"]
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Password must be at least 5 characters"]
    }
});

// ✔ FIXED — prevents duplicate model compilation
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
