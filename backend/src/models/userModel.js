const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    // Keeping 'name' for backward compatibility with other controllers
    name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    role: {
        type: String,
        enum: ['Lawyer', 'Client', 'Staff', 'Admin'],
        default: 'Lawyer'
    },
    notificationSettings: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false 
    },
    avatar: {
        type: String // URL
    },
    cases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function(next) {
    // Update full name
    if (this.isModified('firstName') || this.isModified('lastName')) {
        this.name = `${this.firstName} ${this.lastName}`;
    }

    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
