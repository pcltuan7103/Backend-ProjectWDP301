const Job = require("../models/Job");
const Company = require("../models/Company");
const Profession = require("../models/Profession");
const recruiterRouter = require("../routes/recruiterRouter");
const Application = require("../models/Application");
const Notification = require('../models/Nofication');

// tao moi mot tin tuyen dung
const createJob = async (req, res) => {
    const {
        title,
        description,
        companyId,
        employerId,
        requirement,
        benefit,
        province_city,
        detailed_location,
        working_time,
        due_to,
        salary,
        experience,
        level,
        quantity,
        working_type,
        sex,
        professionId,
    } = req.body;
    // Kiem tra du lieu dau vao:
    if (
        !title ||
        !description ||
        !requirement ||
        !working_time ||
        !salary ||
        !level ||
        !quantity ||
        !working_type ||
        !companyId ||
        !employerId ||
        !province_city ||
        !professionId
    ) {
        return res.status(400).json({ message: "Please enter all field!" });
    }
    try {
        const newJob = new Job({
            title,
            description,
            companyId,
            employerId,
            requirement,
            benefit,
            province_city,
            detailed_location,
            working_time,
            due_to,
            salary,
            experience,
            level,
            quantity,
            working_type,
            sex,
            professionId,
        });

        // Luu db:
        const savedJob = await newJob.save();

        // return:
        return res.status(201).json(savedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Saved failed!" });
    }
};

const getJobById = async (req, res) => {
    const { id } = req.params; // Get the job ID from the request parameters

    try {
        // Find the job by ID
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        return res.status(200).json({ job });
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

const updateJob = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Find the job by ID and update it
        const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the update against the schema
        });

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating job",
            error: error.message,
        });
    }
};

// tao moi mot company:
const createCompany = async (req, res) => {
    const {
        name,
        logo,
        website,
        number_of_employee,
        introduction,
        location,
        isPublic,
        employer,
    } = req.body;
    //kiem tra du lieu dau vao:
    if (!name || !logo) {
        return res.status(400).json({ message: "Please enter all field!" });
    }
    try {
        //tao moi mot company
        const newCompany = new Company({
            name,
            logo,
            website,
            number_of_employee,
            introduction,
            location,
            isPublic,
            employer,
        });

        // luu vao db:
        const savedCompany = await newCompany.save();

        //ok:
        return res
            .status(201)
            .json({ message: "Saved successfully", savedCompany });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Saved failed!" });
    }
};

// lay danh sach tin tuyen dung:
const jobList = async (req, res) => {
    try {
        const jobs = await Job.find();
        return res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Cannot get job list from database!" });
    }
};

const getJobsByEmployerId = async (req, res) => {
    const { employerId } = req.params; // Extract employerId from the request parameters

    try {
        // Find jobs where employerId matches the provided employerId
        const jobs = await Job.find({ employerId: employerId });

        if (!jobs || jobs.length === 0) {
            return res
                .status(404)
                .json({ message: "No jobs found for this employer." });
        }

        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// su dung phuong phap aggregate trong mongodb de thuc hien lookup giua 2 collection 'Job" va 'Company'
const getJob_CompanyList = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: "$companyDetails",
            },
            // {
            //     $project: {
            //         'jobTitle': '$title',
            //         'companyTitle': '$companyDetails.name',
            //         'companyLogo': '$companyDetails.logo',
            //         'salary': 1,
            //         'province_city': 1
            //     }
            // }
        ]);

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job listings", error });
    }
};

// filter theo location:
const filterJobByLocation = async (req, res) => {
    const { selectedLocation } = req.query;
    if (!selectedLocation) {
        return res
            .status(400)
            .json({ message: "Location parameter is required" });
    }
    try {
        const jobs = await Job.aggregate([
            {
                $match: {
                    province_city: selectedLocation, // Lọc theo location
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: "$companyDetails",
            },
            // {
            //     $project: {
            //         'jobTitle': '$title',
            //         'companyTitle': '$companyDetails.name',
            //         'companyLogo': '$companyDetails.logo',
            //         'salary': 1,
            //         'province_city': 1
            //     }
            // }
        ]);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job listings", error });
    }
};

//filter theo salary:
const filterJobBySalary = async (req, res) => {
    const { selectedSalary } = req.query;

    const getSalaryRange = (salary) => {
        const salaryRanges = {
            "Under 5M": [0, 5000000],
            "5-10M": [5000000, 10000000],
            "10-20M": [10000000, 20000000],
            "20-30M": [20000000, 30000000],
            "30-50M": [30000000, 50000000],
            "Above 50M": [50000000, Infinity],
        };
        return salaryRanges[salary] || [0, Infinity];
    };

    if (!selectedSalary) {
        return res
            .status(400)
            .json({ message: "Salary parameter is required" });
    }

    // Lấy khoảng lương dựa trên lựa chọn của người dùng
    const [minSalary, maxSalary] = getSalaryRange(selectedSalary);

    try {
        const jobs = await Job.aggregate([
            {
                $match: {
                    salary: { $gte: minSalary, $lte: maxSalary }, // loc theo khoang luong
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: "$companyDetails",
            },
            // {
            //     $project: {
            //         'jobTitle': '$title',
            //         'companyTitle': '$companyDetails.name',
            //         'companyLogo': '$companyDetails.logo',
            //         'salary': 1,
            //         'province_city': 1
            //     }
            // }
        ]);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job listings", error });
    }
};

// filter job theo experience:
const filterJobByExperience = async (req, res) => {
    const { selectedExperience } = req.query;
    if (!selectedExperience) {
        return res
            .status(400)
            .json({ message: "Experience parameter is required" });
    }
    try {
        const jobs = await Job.aggregate([
            {
                $match: {
                    experience: selectedExperience,
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: "$companyDetails",
            },
            // {
            //     $project: {
            //         'jobTitle': '$title',
            //         'companyTitle': '$companyDetails.name',
            //         'companyLogo': '$companyDetails.logo',
            //         'salary': 1,
            //         'province_city': 1
            //     }
            // }
        ]);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job listings", error });
    }
};

const filterJobByProfession = async (req, res) => {
    const { selectedProfession } = req.query;
    if (!selectedProfession) {
        return res
            .status(400)
            .json({ message: "Profession parameter is required" });
    }

    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "professions",
                    localField: "professionId",
                    foreignField: "_id",
                    as: "professionDetails",
                },
            },
            {
                $unwind: "$professionDetails",
            },
            {
                $match: {
                    "professionDetails.name": selectedProfession,
                },
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: "$companyDetails",
            },
            // {
            //     $project: {
            //         'jobTitle': '$title',
            //         'companyTitle': '$companyDetails.name',
            //         'companyLogo': '$companyDetails.logo',
            //         'salary': 1,
            //         'province_city': 1,
            //         'profession': '$professionDetails.name'
            //     }
            // }
        ]);

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job listings", error });
    }
};

// search job
const searchJob = async (req, res) => {
    const { position, city, category } = req.body;

    let query = {};

    if (position) {
        query.title = { $regex: new RegExp(position, "i") }; // Tim theo title
    }
    if (city && city !== "All provinces/cities") {
        query.province_city = city; // search theo tinh thanh phoos
    }
    if (category && category !== "All professions") {
        const profession = await Profession.findOne({ name: category });
        if (profession) {
            query.professionId = profession._id; // Tim theo professionId
        }
    }
    try {
        // sd lookup lay tt cty
        const jobs = await Job.aggregate([
            { $match: query }, // loc theo query
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: {
                    path: "$companyDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Error fetching jobs", error });
    }
};

const getExperienceLevel = (experience) => {
    const experienceLevels = {
        "No experience": 0,
        "1 year": 1,
        "2 years": 2,
        "3 years": 3,
        "4 years": 4,
        ">5 years": 5,
    };
    return experienceLevels[experience] || 0;
};

// lay danh sach top company:
const getTopCompanies = async (req, res) => {
    try {
        const topCompanies = await Job.aggregate([
            {
                $group: {
                    _id: "$companyId",
                    totalJobs: { $count: {} },
                },
            },
            {
                $sort: { totalJobs: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "companyDetails",
                },
            },
            {
                $unwind: "$companyDetails",
            },
            {
                $project: {
                    _id: 0,
                    companyId: "$companyDetails._id",
                    name: "$companyDetails.name",
                    logo: "$companyDetails.logo",
                    website: "$companyDetails.website",
                    number_of_employee: "$companyDetails.number_of_employee",
                    introduction: "$companyDetails.introduction",
                    location: "$companyDetails.location",
                    totalJobs: 1,
                },
            },
        ]);

        res.status(200).json(topCompanies);
    } catch (error) {
        console.error("Error fetching top companies:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteJob = async (req, res) => {
    const jobId = req.params.id;
    try {
        // Find and delete the job
        const deletedJob = await Job.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({
            message: "Job deleted successfully",
            deletedJob,
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUnacceptedPublicJobs = async (req, res) => {
    try {
        // Fetch jobs where isPublic is false
        const jobs = await Job.find({ isPublic: false });

        // Check if any jobs are found
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No non-public jobs found" });
        }

        // Return the fetched jobs
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error("Error fetching non-public jobs:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAcceptedPublicJobs = async (req, res) => {
    try {
        // Fetch jobs where isPublic is false
        const jobs = await Job.find({ isPublic: true });

        // Check if any jobs are found
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No non-public jobs found" });
        }

        // Return the fetched jobs
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error("Error fetching non-public jobs:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getApplicationByJob = async (req, res) => {
    const jobId = req.params.jobId;

    try {
        // Find applications where the jobId matches
        const applications = await Application.find({ jobId: jobId })

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: 'No applications found for this job' });
        }

        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const acceptApplication = async (req, res) => {
    const applicationId = req.params.id;
    const { userId } = req.body; // Assume userId comes from the request body

    try {
        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ error: "Application not found" });

        // Send notification to the user
        const message = `Your application for job ${application.jobId} has been accepted.`;
        await Notification.create({ userId: application.userId, message });

        return res.status(200).json({ message: 'Application accepted and notification sent.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to accept application" });
    }
};

// Reject application and send notification
const rejectApplication = async (req, res) => {
    const applicationId = req.params.id;
    const { userId } = req.body; // Assume userId comes from the request body

    try {
        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ error: "Application not found" });

        // Send notification to the user
        const message = `Your application for job ${application.jobId} has been rejected.`;
        await Notification.create({ userId: application.userId, message });

        return res.status(200).json({ message: 'Application rejected and notification sent.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to reject application" });
    }
};

//get list companies
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Cannot get company list from database!" });
    }
};

module.exports = {
    createJob,
    getJobById,
    getExperienceLevel,
    getExperienceLevel,
    deleteJob,
    getJobsByEmployerId,
    updateJob,
    jobList,
    getJob_CompanyList,
    createCompany,
    searchJob,
    filterJobByLocation,
    filterJobBySalary,
    filterJobByExperience,
    filterJobByProfession,
    getTopCompanies,
    getUnacceptedPublicJobs,
    getAcceptedPublicJobs,
    getApplicationByJob,
    acceptApplication,
    rejectApplication,
    getCompanies
};
