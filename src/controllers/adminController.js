const Consultation = require('../models/Consultation');
const Feedback = require('../models/Feedback');
const Job = require('../models/Job');
const Profession = require('../models/Profession');
const Report = require('../models/Report');

const acceptJob = async (req, res) => {
    const { id } = req.params; // Get the job ID from the request parameters

    try {
        // Find the job by ID and update the isPublic field
        const job = await Job.findByIdAndUpdate(
            id,
            { isPublic: true }, // Set isPublic to true
            { new: true } // Return the updated document
        );

        // Check if job was found and updated
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({ message: 'Job accepted successfully', job });
    } catch (error) {
        console.error("Error accepting job:", error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// endpoint add a new profession:
const addProfession = async (req, res) => {
    const {name} = req.body;

    if (!name) {
        res.status(400).json({message: 'Enter profession name please!'});
    }

    try {
        const newProfession = new Profession({
            name
        });

        const addedProfession = await newProfession.save();

        return res.status(201).json(addedProfession);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Add profession failed!"});
        return res.status(500).json({ message: 'Add profession failed!' });
    }
};

const getListProfession = async(req, res) => {
    try {
        const professions = await Profession.find();
        return res.status(200).json(professions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Cannot get profession listings!'});
    }
};

//fetch consultations 
const getConsultations = async(req, res) => {
    try {
        const consultations = await Consultation.find();
        return res.status(200).json(consultations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Cannot get consultation listings!'});
    }
};

// xu li handle cho feedback
const handleFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id; 
        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { isHandled: true },
            { new: true } 
        );

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({
            message: 'Feedback handled successfully',
            feedback: feedback
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('jobId'); // populate 'jobId' to include job details
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve reports', error });
    }
}

const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('jobId');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve report details', error });
    }
}

const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve feedback", error });
    }
};

const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate('userId');
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve feedback details', error });
    }
}

module.exports = {addProfession, getListProfession, acceptJob, getReports, getReportById, getFeedbacks, getFeedbackById, handleFeedback, getConsultations};
