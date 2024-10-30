const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
    cvName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        avatar: {
            type: Buffer,
            required: true
        },
        personalName: {
            type: String,
            required: true,
        },
        personalPosition: {
            type: String,
            required: true,
        },
        personalPhone: {
            type: String,
            required: true,
        },
        personalAddress: {
            type: String,
            required: true,
        },
        personalEmail: {
            type: String,
            required: true, 
        },
        personalLink: {
            type: String,
            required: true,
        },
    },
    language: {
        type: String,
        required: true,
    },
    careerProfile: {
        type: String,
        required: true,
    },
    education: [
        {
            schoolName: {
                type: String,
                required: true,
            },
            time: {
                type: String,
                required: true,
            },
            majorName: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        }
    ],
    experience: [
        {
            experienceName: {
                type: String,
                required: true,
            },
            time: {
                type: String,
                required: true,
            },
            companyName: {
                type: String,
                required: true,
            },
            position: {
                type: String,
                required: true,
            },
            description: {
                type: String, 
                required: true,
            },
        }
    ],
    project: [
        {
            projectName: {
                type: String,
                required: true,
            },
            time: {
                type: String,
                required: true,
            },
            position: {
                type: String,
                required: true,
            },
            memberParticipation: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        }
    ],
    skill: [
        {
            name: {
                type: String,
            },
            level: {
                type: Number,
                min: 0,
                max: 100,
            },
        }
    ],
    archivement: [
        {
            name: {
                type: String,
            },
            description: {
                type: String,
            },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('CV', CVSchema);