const express = require('express');
const Job = require('../models/Job');
const {createJob, jobList, getJob_CompanyList, createCompany, searchJob, filterJobByLocation, filterJobBySalary, filterJobByExperience, filterJobByProfession, getTopCompanies, getJobById, updateJob, deleteJob, getJobsByEmployerId, getAcceptedPublicJobs, getUnacceptedPublicJobs, getApplicationByJob, acceptApplication, rejectApplication, getCompanies} = require('../controllers/recruiterController');

const recruiterRouter = express.Router();

// Route tao moi mot job:
recruiterRouter.post('/job/create', createJob);
recruiterRouter.get('/job/:id', getJobById);
recruiterRouter.put('/job/:id', updateJob);
recruiterRouter.delete('/job/:id', deleteJob);
recruiterRouter.get('/jobs/employer/:employerId', getJobsByEmployerId);
recruiterRouter.get('/jobs/no-public', getUnacceptedPublicJobs)
recruiterRouter.get('/jobs/public', getAcceptedPublicJobs)
recruiterRouter.get('/applications/job/:jobId', getApplicationByJob)

// route tao moi mot company:
recruiterRouter.post('/company/create', createCompany);

// Lay danh sach tin tuyen dung:
recruiterRouter.get('/job', jobList);

// Lay danh sach job x company:
recruiterRouter.get('/job-company', getJob_CompanyList);

// route seach for job
recruiterRouter.post('/jobs/search', searchJob);

//filter job theo location
recruiterRouter.get('/filterByLocation', filterJobByLocation);

// filter job theo salary:
recruiterRouter.get('/filterBySalary', filterJobBySalary);

// filter job theo experience: 
recruiterRouter.get('/filterByExperience', filterJobByExperience);

//filter job theo chuyen nganh profession:
recruiterRouter.get('/filterByProfession', filterJobByProfession);

// get top company:
recruiterRouter.get('/top-companies', getTopCompanies);

// Route to accept the application
recruiterRouter.post('/application/:id/accept', acceptApplication);

// Route to reject the application
recruiterRouter.post('/application/:id/reject', rejectApplication);

recruiterRouter.get('/company-list', getCompanies);

module.exports = recruiterRouter;