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
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ['Court Filings', 'Evidence', 'Correspondence', 'General'],
            default: 'General'
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        fileSize: {
            type: Number
        }
    }],
    teamType: {
        type: String,
        enum: ['solo', 'team'],
        default: 'solo'
    },
    leadAttorneyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // Defaults to the creator (clientId) initially
    },
    teamMembers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    activityLog: [{
        type: { type: String, required: true, enum: ['case_created', 'document_uploaded', 'document_deleted', 'team_member_invited', 'team_member_joined', 'team_member_left', 'status_changed'] },
        description: { type: String, required: true },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        metadata: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
