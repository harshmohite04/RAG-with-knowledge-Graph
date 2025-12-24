const Message = require('../models/messageModel');
const User = require('../models/userModel');

// @desc    Get conversations
// @route   GET /api/chats
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Aggregate to find latest message per conversation partner
        // This is a bit complex in Mongo, simplified approach:
        // Find all messages where sender or recipient is current user AND caseId is null (Global Chat)
        
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }],
            caseId: null // Global chats only
        }).sort({ createdAt: -1 });

        const conversationsMap = new Map();

        messages.forEach(msg => {
            const partnerId = msg.sender.toString() === currentUserId 
                ? msg.recipient.toString() // I sent it, partner is recipient
                : msg.sender.toString();   // They sent it, partner is sender

            if (!conversationsMap.has(partnerId)) {
                conversationsMap.set(partnerId, {
                    lastMessage: {
                        content: msg.content,
                        timestamp: msg.createdAt
                    }
                });
            }
        });

        const conversationPartners = await User.find({
            _id: { $in: Array.from(conversationsMap.keys()) }
        }).select('name avatar email');

        const conversations = conversationPartners.map(user => {
            const convo = conversationsMap.get(user._id.toString());
            return {
                userId: user._id,
                name: user.name,
                avatar: user.avatar,
                lastMessage: convo.lastMessage
            };
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
