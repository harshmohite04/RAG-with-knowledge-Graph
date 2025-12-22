const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to prevent double booking for the same lawyer at the same time
// Assuming time is part of the date object or stored separately. 
// If 'date' includes time, this works. If we need slots, we might need granular validation.
// For now, unique index on lawyer + date helps.
bookingSchema.index({ lawyerId: 1, date: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
