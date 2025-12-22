const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed', 'Paused'],
        default: 'Open'
    },
    category: {
        type: String,
        enum: ['Family Law', 'Corporate', 'Real Estate', 'Litigation', 'Other'],
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // optional for now if created by client before assignment? 
        // Or if lawyer creates it, it's required. Let's make it optional initially.
    },
    documents: [{
        type: String // URL or path to document
    }]
}, {
    timestamps: true
});

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
