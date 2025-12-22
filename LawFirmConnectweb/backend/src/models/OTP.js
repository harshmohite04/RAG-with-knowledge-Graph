const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Document automatically deleted after 10 minutes (redundant with expiresAt check but good for cleanup)
    }
});

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;
