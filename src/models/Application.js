const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    introduction: {
        type: String,
        required: true,
    },
    cv: {
        type: Buffer,
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accept', 'reject'], // Enum to define allowed values
        default: 'pending' // Default value is 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
