const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);
module.exports = ContactQuery;
