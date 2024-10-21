const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requirement: {
        type: String,
        required: true,
    },
    benefit: {
        type: String
    },
    province_city: {
        type: String,
        required: true
    },
    detailed_location: {
        type: String,
    },
    working_time: {
        type: String,
        required: true
    },
    due_to: {
        type: Date
    },
    salary: {
        type: Number,
        min: 0,
        required: true
    },
    experience: {
        type: String,
        default: "No experience required"
    },
    level: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    working_type: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        default: "Không yêu cầu"
    },
    professionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profession',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("Job", JobSchema);