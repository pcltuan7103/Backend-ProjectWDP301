const express = require("express");
const authorize = require("../middlewares/authorize");
const { getProfileUser, updateUser } = require("../controllers/userController");

const routerApi = express.Router();

routerApi.get("/users/:id", getProfileUser);
routerApi.put("/update-user/:userId", updateUser);

module.exports = routerApi;
