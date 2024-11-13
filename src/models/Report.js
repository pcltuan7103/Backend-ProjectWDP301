const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    username: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Report', ReportSchema);