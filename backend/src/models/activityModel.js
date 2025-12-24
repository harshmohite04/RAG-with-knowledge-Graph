const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String, // document_upload, note_added, email_received, payment_received
        default: 'note_added'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    meta: {
        type: Map,
        of: String
    }
});

module.exports = mongoose.model('Activity', activitySchema);
