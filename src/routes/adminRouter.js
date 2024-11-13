const express = require('express');
const Profession = require('../models/Profession');
const {addProfession, getListProfession, acceptJob, getConsultations, handleFeedback} = require('../controllers/adminController');

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

module.exports = adminRouter;