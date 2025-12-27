const Message = require('../models/Message');

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: contactId },
                { sender: contactId, recipient: userId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { contactId, content } = req.body;
        const userId = req.user._id;

        if (!contactId || !content) {
            return res.status(400).json({ message: 'Recipient and content are required' });
        }

        const newMessage = await Message.create({
            sender: userId,
            recipient: contactId,
            content
        });

        await newMessage.populate('sender', 'firstName lastName _id');
        await newMessage.populate('recipient', 'firstName lastName _id');

        // Emit real-time event
        const io = req.app.get('socketio');
        if (io) {
            io.to(contactId).emit('newMessage', newMessage);
            io.to(userId.toString()).emit('newMessage', newMessage); // Also emit to sender (for other devices/tabs)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark messages as read
exports.markMessagesRead = async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user._id;

        // Update all unread messages from contact to me
        const result = await Message.updateMany(
            { sender: contactId, recipient: userId, read: false },
            { $set: { read: true } }
        );

        // Emit real-time event to sender that messages were read
        const io = req.app.get('socketio');
        if (io && result.modifiedCount > 0) {
            io.to(contactId).emit('messagesRead', { 
                recipientId: userId.toString(),
                contactId: contactId // The sender of the messages (who needs to know they are read)
            });
        }

        res.json({ message: 'Messages marked as read', count: result.modifiedCount });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get total unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Message.countDocuments({ recipient: userId, read: false });
        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
