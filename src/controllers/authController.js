require('dotenv').config();
const {
    registerEmployerService,
    loginService,
    refreshAccessToken,
    logoutService,
    registerAdminUserService,
} = require("../services/authService");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Role = require("../models/Role");

const otpStore = new Map();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nguyenanhtu3703@gmail.com",
        pass: "ietj qlee vvwb dtce",
    },
});

const sendOtpUser = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "OTP for Registration",
            text: `Your OTP is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            status: 200,
            message: "OTP sent to email",
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error });
    }
};

const verifyOtpAndRegisterUser = async (req, res) => {
    try {
        const { email, otp, password, username } = req.body;

        // Log incoming request
        console.log("Received request to verify OTP:", { email, otp });

        // Validate incoming data
        if (!email || !otp || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check OTP validity
        const otpRecord = otpStore.get(email);
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Log password and salt rounds
        console.log("Password before hashing:", password);
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Ensure saltRounds has a default
        console.log("Salt rounds value:", saltRounds);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Find user role
        const userRole = await Role.findOne({ name: "user" });
        if (!userRole) {
            console.error("User role not found in the database");
            return res.status(500).json({ message: "User role not found in the system" });
        }

        // Create the new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
            role: [userRole._id],
        });

        // Remove OTP after successful registration
        otpStore.delete(email); 
        res.status(201).json({
            message: "User registered successfully",
            data: newUser,
            status: 200,
        });
    } catch (error) {
        // Log specific error message
        console.error("Error during OTP verification:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const registerAdmin = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Gọi service để thực hiện logic đăng ký người dùng
        const data = await registerAdminUserService(email, password, username);

        // Kiểm tra phản hồi từ service
        if (data.error) {
            return res.status(400).json({ message: data.error });
        }

        return res
            .status(201)
            .json({ message: "User registered successfully", data });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loginService(email, password);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const sendOtpEmployer = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "OTP for Registration",
            text: `Your OTP is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            status: 200,
            message: "OTP sent to email",
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error });
    }
};

const verifyOtpAndRegisterEmployer = async (req, res) => {
    try {
        const { email, otp, password, username } = req.body;

        // Log incoming request
        console.log("Received request to verify OTP:", { email, otp });

        // Validate incoming data
        if (!email || !otp || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check OTP validity
        const otpRecord = otpStore.get(email);
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Log password and salt rounds
        console.log("Password before hashing:", password);
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10; // Ensure saltRounds has a default
        console.log("Salt rounds value:", saltRounds);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Find user role
        const userRole = await Role.findOne({ name: "employer" });
        if (!userRole) {
            console.error("User role not found in the database");
            return res.status(500).json({ message: "User role not found in the system" });
        }

        // Create the new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
            role: [userRole._id],
        });

        // Remove OTP after successful registration
        otpStore.delete(email); 
        res.status(201).json({
            message: "User registered successfully",
            data: newUser,
            status: 200,
        });
    } catch (error) {
        // Log specific error message
        console.error("Error during OTP verification:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newTokens = await refreshAccessToken(refreshToken);
        res.status(200).json(newTokens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        await logoutService(refresh_token);
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAccount = async (req, res) => {
    res.status(200).json(req.user);
};

const sendOtpForForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // OTP valid for 10 minutes

        // Send OTP via email (you should replace the mailOptions with your actual email service)
        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to email", status: 200 });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Validate input fields
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check OTP validity
        const otpRecord = otpStore.get(email);
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash the new password
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user's password
        await User.updateOne({ email }, { password: hashedPassword });

        // Remove the OTP after successful reset
        otpStore.delete(email);
        res.status(200).json({ message: "Password reset successful", status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const sendOtpResetPassword = async (req, res) => {
    console.log("Received body:", req.body); // Log the entire request body
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // OTP valid for 10 minutes

        // Send OTP via email
        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to email", status: 200 });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};



module.exports = {
    login,
    refreshToken,
    logout,
    getAccount,
    registerAdmin,
    sendOtpUser,
    sendOtpEmployer,
    verifyOtpAndRegisterUser,
    verifyOtpAndRegisterEmployer,
    sendOtpForForgotPassword,
    forgotPassword,
    sendOtpResetPassword
};
