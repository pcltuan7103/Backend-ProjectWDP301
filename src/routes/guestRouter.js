const express = require('express');
const Consultation = require('../models/Consultation');
const {createConsultation} = require('../controllers/guestController');

const guestRouter = express.Router();

// Route for sign up a consultation
guestRouter.post('/create/consultation', createConsultation);

module.exports = guestRouter;