const Message = require('../models/messageModel');

// @desc    Get case messages
// @route   GET /api/cases/:caseId/messages
// @access  Private
exports.getCaseMessages = async (req, res) => {
    try {
        const messages = await Message.find({ caseId: req.params.caseId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 }); // Chronological order

        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            sender: msg.sender.name,
            senderId: msg.sender._id,
            content: msg.content,
            time: msg.createdAt, // Frontend can format
            attachments: msg.attachments
        }));

        res.status(200).json(formattedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Send message to case
// @route   POST /api/cases/:caseId/messages
// @access  Private
exports.sendCaseMessage = async (req, res) => {
    try {
        const { content, attachments } = req.body;

        const message = await Message.create({
            caseId: req.params.caseId,
            sender: req.user.id,
            content,
            attachments: attachments || [] 
        });

        await message.populate('sender', 'name avatar');

        res.status(201).json({
            id: message._id,
            sender: message.sender.name,
            senderId: message.sender._id,
            content: message.content,
            time: message.createdAt,
            attachments: message.attachments
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};
