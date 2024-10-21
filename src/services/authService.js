require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Role = require("../models/Role");

const registerUserService = async (email, password, username) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.log("User with this email already exists");
      return { error: "User with this email already exists" };
    }

    // Kiểm tra các trường dữ liệu
    if (!email || !password || !username) {
      throw new Error("All fields are required");
    }

    // Băm mật khẩu
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Tìm vai trò `user`
    const userRole = await Role.findOne({ name: "user" });

    // Tạo người dùng mới
    const newUser = await User.create({
      email,
      password: hashPassword,
      username,
      role: [userRole._id], // Gán vai trò `user` cho người dùng mới
    });

    return newUser;
  } catch (error) {
    console.log("Error:", error);
    return { error: "An error occurred during registration" };
  }
};

const loginService = async (email, password) => {
  try {
    // Check if user already exists
    const user = await User.findOne({ email: email }).populate("role");
    if (user) {
      //compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password is invalid",
        };
      } else {
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        //create an access token
        const payload = {
          user: userWithoutPassword,
        };
        const access_token = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
          expiresIn: process.env.JWT_ACCESS_EXPIRE,
        });
        const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });

        return {
          EC: 0,
          user: userWithoutPassword,
          EM: "Log In Successfully",
          access_token,
          refresh_token,
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password is invalid",
      };
    }
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

const registerEmployerService = async (email, password, username) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.log("User with this email already exists");
      return { error: "User with this email already exists" };
    }

    // Kiểm tra các trường dữ liệu
    if (!email || !password || !username) {
      throw new Error("All fields are required");
    }

    // Băm mật khẩu
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Tìm vai trò `user`
    const userRole = await Role.findOne({ name: "employer" });

    // Tạo người dùng mới
    const newUser = await User.create({
      email,
      password: hashPassword,
      username,
      role: [userRole._id], // Gán vai trò `user` cho người dùng mới
    });

    return newUser;
  } catch (error) {
    console.log("Error:", error);
    return { error: "An error occurred during registration" };
  }
};

const refreshAccessToken = async (refresh_token) => {
  try {
    if (!refresh_token) throw new Error("Refresh token required");

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).populate("role");
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    if (!user) throw new Error("User not found");

    const newAccessToken = jwt.sign(
      { user: userWithoutPassword },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
      }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error(error.message);
  }
};

const logoutService = async (refresh_token) => {
  try {
    if (!refresh_token) throw new Error("Refresh token required");

    // Xác thực refresh token
    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

    return { message: "Logout successful" };
  } catch (error) {
    throw new Error(error.message);
  }
};

const registerAdminUserService = async (email, password, username) => {
  try {
    // Check if the email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.log("User with this email already exists");
      return { error: "User with this email already exists" };
    }

    // Validate required fields
    if (!email || !password || !username) {
      throw new Error("All fields are required");
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Find the role 'admin'
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      return { error: "Admin role not found" };
    }

    // Create the new admin user
    const newAdminUser = await User.create({
      email,
      password: hashPassword,
      username,
      role: [adminRole._id], // Assign the 'admin' role
    });

    return newAdminUser;
  } catch (error) {
    console.log("Error:", error);
    return { error: "An error occurred during admin registration" };
  }
};


module.exports = {
  registerUserService,
  loginService,
  registerEmployerService,
  refreshAccessToken,
  logoutService,
  registerAdminUserService
};
