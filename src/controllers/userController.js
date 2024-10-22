const { getProfileUserService, updateUserService, } = require("../services/userService");
const Application = require('../models/Application');
const User = require("../models/User");
const Report = require('../models/Report');
const Favorite = require('../models/Favorite');
const { mongo } = require("mongoose");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const getProfileUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await getProfileUserService(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// Controller to update username by user ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      username: updatedUser.username,
    });
  } catch (error) {
    console.error("Error updating user:", error); // Log full error for debugging
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message || error });
  }
};

// tao moi report:
const createReport = async (req, res) => {
  const { jobId, username, phone, email, description } = req.body;

  if (!jobId || !username || !phone || !email || !description) {
    return res.status(400).json({ message: "Please enter all fields!" });
  };

  try {
    const newReport = new Report({ jobId, username, phone, email, description });
    const savedReport = await newReport.save();
    return res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Can not add a new report to database!' });
  }
};

const applyJob = async (req, res) => {
  try {
    const { introduction } = req.body;
    const jobId = req.query.jobId;

    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được tải lên.' });
    }

    const newApplication = new Application({
      introduction,
      cv: req.file.buffer, // Lưu buffer của file
      jobId,
    });

    await newApplication.save();
    return res.status(201).json({ message: 'Đơn ứng tuyển đã được gửi thành công!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi gửi đơn ứng tuyển.' });
  }
};

// Endpoint lưu tin yêu thích
const markFavorite = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    // Kiểm tra xem đã lưu chưa
    const existingFavorite = await Favorite.findOne({ userId, jobId });

    if (existingFavorite) {
      // Nếu đã lưu, bỏ lưu
      await Favorite.deleteOne({ userId, jobId });
      return res.status(200).json({ message: 'Đã bỏ lưu tin.' });
    } else {
      // Nếu chưa lưu, thêm vào danh sách lưu
      const newFavorite = new Favorite({ userId, jobId });
      await newFavorite.save();
      return res.status(201).json({ message: 'Tin đã được lưu thành công!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu tin.' });
  }
};

//favorite
const getFavorite = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "No userId provided!" });
  }
  try {
    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' } // Populate companyId bên trong jobId
      })
      .populate('userId');

    if (favorites.length === 0) {
      return res.status(404).json({ message: "No favorite jobs found for this user." });
    }

    return res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot fetch favorite list!" });
  }
};

// bo luu tin:
const deleteFavorite = async (req, res) => {
  const { favoriteId } = req.params;

  try {
    const favorite = await Favorite.findById(favoriteId);
  
    if (!favorite) {
      return res.status(404).json({ message: "Mục yêu thích không tồn tại." });
    }
    await Favorite.findByIdAndDelete(favoriteId);

    res.status(200).json({ message: "Mục yêu thích đã được xóa thành công." });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi xóa mục yêu thích." });
  }
};

module.exports = { getProfileUser, updateUser, createReport, applyJob, markFavorite, getFavorite, deleteFavorite };
