const Activity = require('../models/activityModel');

// @desc    Get case activities
// @route   GET /api/cases/:caseId/activities
// @access  Private
exports.getActivities = async (req, res) => {
    try {
        const { type, search } = req.query;
        let query = { caseId: req.params.caseId };

        if (type) query.type = type;
        if (search) {
             query.title = { $regex: search, $options: 'i' };
        }

        const activities = await Activity.find(query)
            .populate('user', 'name avatar')
            .sort({ date: -1 });

        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add activity
// @route   POST /api/cases/:caseId/activities
// @access  Private
exports.addActivity = async (req, res) => {
    try {
        const { title, description, date, time, type } = req.body;
        
        // combine date and time if provided, else use now or provided date
        let activityDate = date ? new Date(date) : new Date();
        if (date && time) {
            // Simple string concat for ISODate if date is YYYY-MM-DD and time HH:mm
             activityDate = new Date(`${date}T${time}:00`);
        }

        const activity = await Activity.create({
            caseId: req.params.caseId,
            user: req.user.id,
            title,
            description,
            type: type || 'note_added',
            date: activityDate
        });
        
        // Populate user before returning
        await activity.populate('user', 'name avatar');

        res.status(201).json(activity);
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};
