const Job = require('../models/Job');
const Profession = require('../models/Profession');

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

module.exports = {addProfession, getListProfession, acceptJob};
