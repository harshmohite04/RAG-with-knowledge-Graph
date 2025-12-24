const CalendarEvent = require('../models/calendarModel');

// @desc    Get calendar events
// @route   GET /api/calendar
// @access  Private
exports.getEvents = async (req, res) => {
    try {
        const { start, end } = req.query;
        let query = { userId: req.user.id };

        if (start && end) {
            query.date = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }

        const events = await CalendarEvent.find(query);

        const formattedEvents = events.map(event => ({
            id: event._id,
            title: event.title,
            date: event.date.toISOString().split('T')[0], // YYYY-MM-DD
            time: event.time,
            type: event.type,
            caseId: event.caseId
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create calendar event
// @route   POST /api/calendar
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        const { title, date, time, type, description, caseId } = req.body;

        const event = await CalendarEvent.create({
            title,
            date,
            time,
            type,
            description,
            caseId,
            userId: req.user.id
        });

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};
