const User = require('../models/userModel');

// @desc    Create a new user (Global)
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
    // This seems redundant with Auth Signup but keeping for compatibility if existing
    res.status(501).json({ error: 'Use /api/auth/signup' });
};

// @desc    Get All Users (Supports filtering by caseId)
// @route   GET /api/users
// @access  Private
exports.getUsers = async (req, res) => {
    try {
        const { caseId } = req.query;
        let query = {};

        if (caseId) {
             // Find case to get team
             const Case = require('../models/caseModel'); // Lazy load to avoid circular dependency if any (though logic usually okay)
             const caseItem = await Case.findById(caseId);
             
             if (!caseItem) {
                  return res.status(404).json({ error: 'Case not found' });
             }
             
             const teamIds = caseItem.assignedTeam.map(member => member.user);
             query._id = { $in: teamIds };
        }

        const users = await User.find(query).select('name email role avatar');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get user cases
// @route   GET /api/users/:id/cases
// @access  Private
exports.getUserCases = async (req, res) => {
    // Logic to get cases for a specific user
    res.status(501).json({ error: 'Not Implemented' });
};

// @desc    Search Users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Please provide an email to search' });
        }

        const user = await User.findOne({ email: { $regex: email, $options: 'i' } }).select('name email role avatar');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
             return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            notificationSettings: user.notificationSettings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Update User Profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
             return res.status(404).json({ error: 'User not found' });
        }

        const { firstName, lastName, email, phone, notificationSettings } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        // name is auto-updated by pre-save hook
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (notificationSettings) user.notificationSettings = notificationSettings;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
