const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

// Search users by email
exports.searchUsers = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        // Search for users with email matching the regex, excluding the current user
        // Using regex for partial match, but user asked for exact match or something similar? 
        // Plan said regex. Let's stick to partial match for better UX.
        // Also exclude the requester themselves.
        const users = await User.find({
            email: { $regex: email, $options: 'i' },
            _id: { $ne: req.user._id } 
        }).select('firstName lastName email _id role');

        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send a friend request
exports.sendRequest = async (req, res) => {
    try {
        const { contactId } = req.body;
        const userId = req.user._id;

        if (userId.toString() === contactId) {
             return res.status(400).json({ message: 'Cannot add yourself' });
        }

        const recipient = await User.findById(contactId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already friends
        const sender = await User.findById(userId);
        if (sender.contacts.includes(contactId)) {
            return res.status(400).json({ message: 'User is already in your contacts' });
        }

        // Check for existing pending request (either direction)
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: userId, recipient: contactId, status: 'PENDING' },
                { sender: contactId, recipient: userId, status: 'PENDING' }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already pending' });
        }

        const newRequest = await FriendRequest.create({
            sender: userId,
            recipient: contactId
        });

        await newRequest.populate('recipient', 'firstName lastName email _id role');

        res.status(201).json({ message: 'Friend request sent', request: newRequest });
    } catch (error) {
        console.error('Send request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get pending requests (incoming)
exports.getRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            recipient: req.user._id,
            status: 'PENDING'
        }).populate('sender', 'firstName lastName email _id role');
        
        res.json(requests);
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Handle request (Accept/Reject)
exports.handleRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body; // 'accept' or 'reject'
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to handle this request' });
        }

        if (request.status !== 'PENDING') {
            return res.status(400).json({ message: 'Request already handled' });
        }

        if (action === 'accept') {
            request.status = 'ACCEPTED';
            await request.save();

            // Add to contacts for both users
            await User.findByIdAndUpdate(request.sender, { $addToSet: { contacts: request.recipient } });
            await User.findByIdAndUpdate(request.recipient, { $addToSet: { contacts: request.sender } });

            res.json({ message: 'Friend request accepted' });
        } else if (action === 'reject') {
            request.status = 'REJECTED';
            await request.save();
            res.json({ message: 'Friend request rejected' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error('Handle request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all contacts
exports.getContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('contacts', 'firstName lastName email _id role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
