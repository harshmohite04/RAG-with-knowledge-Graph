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
    legalMatter: {
        type: String,
        enum: ['Family Law', 'Corporate', 'Real Estate', 'Litigation', 'Other'],
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedLawyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    documents: [{
        fileName: { type: String, required: true },
        filePath: { type: String, required: true },
        category: {
            type: String,
            enum: ['Court Filings', 'Evidence', 'Correspondence', 'General'],
            default: 'General'
        },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        uploadedAt: { type: Date, default: Date.now },
        fileSize: { type: Number },
        recordStatus: { type: Number, enum: [0, 1], default: 1 }
    }],
    teamType: {
        type: String,
        enum: ['solo', 'team'],
        default: 'solo'
    },
    leadAttorneyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    teamMembers: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'Member' },
        joinedAt: { type: Date, default: Date.now }
    }],
    activityLog: [{
        type: { type: String, required: true },
        description: { type: String, required: true },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        metadata: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now }
    }],
    billing: [{
        invoiceId: { type: String }, // or ObjectId
        amount: { type: Number },
        description: { type: String },
        status: { type: String, enum: ['Paid', 'Unpaid', 'Pending'], default: 'Unpaid' },
        date: { type: Date, default: Date.now },
        receiptUrl: { type: String } // URL to S3 or local path
    }],
    settings: {
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        }
    },
    recordStatus: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, {
    timestamps: true
});

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;
