const express = require("express");
const authorize = require("../middlewares/authorize");
const { getProfileUser, updateUser, createReport, applyJob, markFavorite, getFavorite, deleteFavorite } = require("../controllers/userController");
const User = require("../models/User");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const routerApi = express.Router();

// routerApi.get("/users/:id", getProfileUser);
routerApi.put("/update/:id", updateUser);

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

module.exports = routerApi;
