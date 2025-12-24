const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    date: {
        type: Date, // Spec says YYYY-MM-DD but Date object is better for Mongo
        required: [true, 'Please add a date']
    },
    time: {
        type: String, // HH:mm
        required: [true, 'Please add a time']
    },
    type: {
        type: String,
        enum: ['Court', 'Meeting', 'Deadline'],
        required: [true, 'Please add an event type']
    },
    description: {
        type: String
    },
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    },
    userId: {
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
