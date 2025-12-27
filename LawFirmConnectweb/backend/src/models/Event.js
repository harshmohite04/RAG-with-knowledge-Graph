const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: String, // Storing time separately as per frontend logic
    endTime: String,
    allDay: {
        type: Boolean,
        default: false
    },
    location: String,
    attendees: [String], 
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    },
    type: {
        type: String,
        default: 'Appointment'
    },
    status: {
        type: String,
        default: 'Scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
