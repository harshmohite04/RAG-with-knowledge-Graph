const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get conversations / messages
// @route   GET /messages
// @access  Private
const getMessages = async (req, res, next) => {
    try {
        // Simple fetch all messages where user is sender or receiver
        // In a real app, we'd group by conversation. 
        // For requirement "Fetch conversations", let's return a flat list or grouped list.
        // Flat list sorted by time is easiest for MVP 1.
        
        const messages = await Message.find({
            $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
        })
        .populate('senderId', 'firstName lastName email')
        .populate('receiverId', 'firstName lastName email')
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        next(error);
    }
};

// @desc    Send message
// @route   POST /messages
// @access  Private
const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            senderId: req.user._id,
            receiverId,
            content
        });

        const populatedMessage = await message.populate('senderId', 'firstName lastName');
        // populate receiver too if needed in response

        res.status(201).json(populatedMessage);
    } catch (error) {
        next(error);
    }
};

module.exports = { getMessages, sendMessage };
