const Company = require("../models/Company");

const getCompany = async (req, res) => {
    const { userId } = req.params;
    try {
        const company = await Company.findOne({ employer: userId });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const createCompany = async (req, res) => {
    try {
        const { name, number_of_employee, location, introduction, isPublic, employer, website } = req.body;
        const logo = req.file ? req.file.path : null; // Get the file path from multer

        // Create a new company instance
        const newCompany = new Company({
            name,
            number_of_employee,
            location,
            introduction,
            logo, 
            website,
            isPublic,
            employer,
        });

        // Save the company to the database
        const savedCompany = await newCompany.save();
        return res.status(201).json(savedCompany); // Send the saved company as the response
    } catch (error) {
        console.error("Error creating company:", error); // Log the exact error
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getCompany,
    createCompany,
};
