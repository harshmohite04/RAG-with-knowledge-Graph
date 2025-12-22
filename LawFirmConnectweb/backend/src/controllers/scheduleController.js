const Booking = require('../models/Booking');

// @desc    Get bookings
// @route   GET /schedule
// @access  Private
const getBookings = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === 'lawyer') {
            query.lawyerId = req.user._id;
        } else {
            query.clientId = req.user._id;
        }

        const bookings = await Booking.find(query)
            .populate('clientId', 'firstName lastName')
            .populate('lawyerId', 'firstName lastName')
            .sort({ date: 1 });

        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

// @desc    Create booking
// @route   POST /schedule
// @access  Private
const createBooking = async (req, res, next) => {
    try {
        const { lawyerId, date, notes } = req.body;

        // Check availability
        // Assuming 'date' encompasses time. If strict hour slots are needed, logic applies here.
        // We rely on the Unique Index { lawyerId: 1, date: 1 } for strict duplicate prevention.
        // But better user experience to check first.

        const existingBooking = await Booking.findOne({ lawyerId, date });
        if (existingBooking) {
            res.status(400);
            throw new Error('This slot is already booked.');
        }

        const booking = await Booking.create({
            lawyerId,
            clientId: req.user._id,
            date,
            notes,
            status: 'Pending'
        });

        res.status(201).json(booking);
    } catch (error) {
        // Handle duplicate key error from MongoDB if race condition occurred
        if (error.code === 11000) {
            res.status(400);
            const err = new Error('This slot is already booked.');
            next(err);
        } else {
            next(error);
        }
    }
};

module.exports = { getBookings, createBooking };
