const express = require("express");
const {
  registerUser,
  refreshToken,
  registerEmployer,
  login,
  getAccount,
  logout,
  registerAdmin,
  sendOtpUser,
  verifyOtpAndRegisterUser,
  sendOtpEmployer,
  verifyOtpAndRegisterEmployer,
  sendOtpForPasswordReset,
  resetPassword,
  sendOtpForForgotPassword,
  forgotPassword,
  sendOtpResetPassword,
} = require("../controllers/authController");
const authorize = require("../middlewares/authorize");

const routerApi = express.Router();

routerApi.post("/send-otp-user", sendOtpUser);
routerApi.post("/verify-otp-user", verifyOtpAndRegisterUser);
routerApi.post("/send-otp-employer", sendOtpEmployer);
routerApi.post("/verify-otp-employer", verifyOtpAndRegisterEmployer);
routerApi.post("/send-otp-forgot", sendOtpForForgotPassword);
routerApi.post("/send-otp-reset", sendOtpResetPassword)
routerApi.post("/forgot-password", forgotPassword);
routerApi.post("/register-admin", registerAdmin);
routerApi.post("/login", login);
routerApi.post("/refresh-token", refreshToken);
routerApi.post("/logout", logout);
routerApi.get("/account", authorize("user"), getAccount);

module.exports = routerApi;
