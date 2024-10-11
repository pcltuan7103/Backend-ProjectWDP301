const Profession = require('../models/Profession');

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

module.exports = {addProfession, getListProfession};
