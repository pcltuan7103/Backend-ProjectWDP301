const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    requirement: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);