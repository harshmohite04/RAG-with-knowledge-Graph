const Case = require('../models/Case');
const Message = require('../models/Message');
const Booking = require('../models/Booking');

// @desc    Get user profile summary
// @route   GET /portal/home
// @access  Private
const getPortalHome = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Aggregate Stats
        const caseQuery = req.user.role === 'lawyer' ? { lawyerId: req.user._id } : { clientId: req.user._id };
        const activeCasesCount = await Case.countDocuments({ ...caseQuery, status: { $ne: 'Closed' } }); // Count non-closed cases

        const unreadMessagesCount = await Message.countDocuments({ receiverId: req.user._id, read: false });

        const bookingQuery = req.user.role === 'lawyer' ? { lawyerId: req.user._id } : { clientId: req.user._id };
        // Find next upcoming booking
        const nextBooking = await Booking.findOne({ 
            ...bookingQuery, 
            date: { $gte: new Date() } 
        }).sort({ date: 1 });

        res.json({
            user,
            stats: {
                activeCases: activeCasesCount,
                unreadMessages: unreadMessagesCount,
                nextHearing: nextBooking ? nextBooking.date : null
            },
            message: `Welcome back, ${user.firstName}`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPortalHome };
