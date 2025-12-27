const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id }).sort({ startDate: 1 });
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
         console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        
        if (event.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
         console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
