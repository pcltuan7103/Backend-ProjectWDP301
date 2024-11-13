const nodemailer = require("nodemailer");

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'nguyenanhtu3703@gmail.com',
    pass: 'ietj qlee vvwb dtce',
  },
});

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Save OTP for email in memory (or replace with DB storage for production)
const otpStore = {}; // Temporary storage for OTPs

const saveOTPForEmail = (email, otp) => {
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 minutes
};

const verifyOTPForEmail = (email, otp) => {
  const record = otpStore[email];
  if (record && record.otp === otp && record.expires > Date.now()) {
    delete otpStore[email]; // OTP is valid, remove it after verification
    return true;
  }
  return false;
};
