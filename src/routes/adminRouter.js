const express = require('express');
const Profession = require('../models/Profession');
const {addProfession, getListProfession} = require('../controllers/adminController');

const adminRouter = express.Router();

// api add new profession:
adminRouter.post('/profession/create', addProfession);

// render profession list for profession selected option"
adminRouter.get('/profession', getListProfession);

module.exports = adminRouter;