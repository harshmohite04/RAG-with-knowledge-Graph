const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
        default: 'PENDING' 
    }
}, {
    timestamps: true
});

// Ensure unique request per sender-recipient pair (if pending)
friendRequestSchema.index({ sender: 1, recipient: 1, status: 1 });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest;
