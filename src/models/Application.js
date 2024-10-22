const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);