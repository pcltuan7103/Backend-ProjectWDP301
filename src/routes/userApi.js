const express = require("express");
const authorize = require("../middlewares/authorize");
const { getProfileUser, updateUser } = require("../controllers/userController");
const User = require("../models/User");

const routerApi = express.Router();

// routerApi.get("/users/:id", getProfileUser);
routerApi.put("/update/:id", updateUser);

module.exports = routerApi;
