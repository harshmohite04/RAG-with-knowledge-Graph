const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // For Global Chat (Direct Message)
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // For Case Chat
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    },
    content: {
        type: String,
        required: [true, 'Please add message content']
    },
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number
    }],
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
