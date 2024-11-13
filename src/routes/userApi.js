const express = require("express");
const authorize = require("../middlewares/authorize");
const { getProfileUser, updateUser, createReport, applyJob, markFavorite, getFavorite, deleteFavorite, getJob_updateTime, addFeedback, getNoficationByUser, setNoficationRead, getFeedback, saveCV, getCvByUserId, getDetailedCVById, getAllUsers, getAllEmployers, getUserById, deleteCvById, getApplicationByUserId, getUserProfession } = require("../controllers/userController");
const User = require("../models/User");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const routerApi = express.Router();

routerApi.get("/users/:id", getProfileUser);
routerApi.put("/update/:id", updateUser);

//get user profession:
routerApi.get('/users/profession/:id', getUserProfession);

//route tao moi report
routerApi.post('/report/create', createReport)

//apply job
routerApi.post('/apply', upload.single('cv'), applyJob);

// api mark favorite
routerApi.post('/favorite', markFavorite);

//api get favorite list:
routerApi.get('/favorite', getFavorite);

// bo luu tin:
routerApi.delete('/favorite/:favoriteId', deleteFavorite);

//get sl job vs tg update:
routerApi.get('/job-stats', getJob_updateTime);

//feedback
routerApi.post('/feedback', addFeedback);

routerApi.get('/notification/:userId', getNoficationByUser)

routerApi.post('/read/:userId', setNoficationRead)

//fetch fbacks
routerApi.get('/feedback', getFeedback);

//save cv: 
routerApi.post('/cv', saveCV);

// danh sach cv theo userid:
routerApi.get('/cv/user/:userId', getCvByUserId);

// // detail cv by id:
routerApi.get('/cv/:id', getDetailedCVById);

routerApi.get('/get-all', getAllUsers)
routerApi.get('/get-all-employers', getAllEmployers)
routerApi.get("/get/:id", getUserById);

// xoa cv theo id:
routerApi.delete('/cv/:id', deleteCvById);

//get application by userid
routerApi.get('/applications/:userId', getApplicationByUserId);

module.exports = routerApi;
