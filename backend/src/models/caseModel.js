const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a case title'],
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    legalMatter: {
        type: String,
        required: [true, 'Please add a legal matter']
    },
    clientName: {
        type: String,
        required: [true, 'Please add a client name']
    },
    assignedTeam: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['Lead Attorney', 'Associate', 'Paralegal', 'Client'],
            default: 'Associate'
        }
    }],
    documents: [{
        name: String,
        url: String, // Path to file or S3 URL
        type: String, // Mimetype
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Case', caseSchema);
