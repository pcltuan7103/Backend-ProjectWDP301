const express = require("express");
const {
  registerUser,
  refreshToken,
  registerEmployer,
  login,
  getAccount,
  logout,
  registerAdmin,
} = require("../controllers/authController");
const authorize = require("../middlewares/authorize");

const routerApi = express.Router();

routerApi.post("/register-user", registerUser);
routerApi.post("/register-admin", registerAdmin);
routerApi.post("/login", login);
routerApi.post("/register-employer", registerEmployer);
routerApi.post("/refresh-token", refreshToken);
routerApi.post("/logout", logout);
routerApi.get("/account", authorize("user"), getAccount);

module.exports = routerApi;
