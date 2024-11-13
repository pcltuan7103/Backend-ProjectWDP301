const express = require('express');
const Profession = require('../models/Profession');
const {addProfession, getListProfession, acceptJob, getReports, getReportById, getFeedbacks, getFeedbackById, getConsultations, handleFeedback} = require('../controllers/adminController');

const adminRouter = express.Router();

// api add new profession:
adminRouter.post('/profession/create', addProfession);

// render profession list for profession selected option"
adminRouter.get('/profession', getListProfession);

adminRouter.put('/accept-job/:id', acceptJob);

// get consultations:
adminRouter.get('/consultations', getConsultations);

// handle feedback:
adminRouter.put('/feedback/:id/handle', handleFeedback);
adminRouter.get('/reports', getReports);

adminRouter.get('/report/:id', getReportById);

adminRouter.get('/feedbacks', getFeedbacks);

adminRouter.get('/feedback/:id', getFeedbackById);

module.exports = adminRouter;