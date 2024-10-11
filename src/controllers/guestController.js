const Consultation = require('../models/Consultation');

const createConsultation = async(req, res) => {
    const {name, email, phone, location, requirement} = req.body;

    // Kiem tra du lieu lay tu request:
    if (!name || !email || !phone || !location || !requirement) {
        return res.status(400).json({message: "Please enter all fields!"});
    }

    try {
        // Tao consultation moi:
        const newConsultation = new Consultation({
            name, 
            email,
            phone,
            location,
            requirement
        });

        // Luu vao db:
        const savedConsultation = await newConsultation.save();

        // return lai ket qua:
        res.status(201).json(savedConsultation);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Saved failed!'});
    }
};

module.exports = {createConsultation};