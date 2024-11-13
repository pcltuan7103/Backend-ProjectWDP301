const express = require("express");
const authorize = require("../middlewares/authorize");
const { getProfileUser, updateUser, createReport, applyJob, markFavorite, getFavorite, deleteFavorite, getJob_updateTime, addFeedback, getNoficationByUser, setNoficationRead, getAllUsers, getAllEmployers, getUserById, toggleUserBlockStatus } = require("../controllers/userController");
const User = require("../models/User");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const routerApi = express.Router();

routerApi.put("/update/:id", updateUser);

routerApi.post('/report/create', createReport)

routerApi.post('/apply', upload.single('cv'), applyJob);

routerApi.post('/favorite', markFavorite);

routerApi.get('/favorite', getFavorite);

routerApi.delete('/favorite/:favoriteId', deleteFavorite);

routerApi.get('/job-stats', getJob_updateTime);

routerApi.post('/feedback', addFeedback);

routerApi.get('/nofication/:userId', getNoficationByUser)

routerApi.post('/read/:userId', setNoficationRead)

routerApi.get('/get-all', getAllUsers)

routerApi.get('/get-all-employers', getAllEmployers)

routerApi.get("/get/:id", getUserById);

routerApi.put("/toggle-block/:id", toggleUserBlockStatus);

module.exports = routerApi;
