const { getProfileUserService, getProfileUserProfession } = require("../services/userService");
const Application = require('../models/Application');
const Notification = require('../models/Nofication');
const User = require("../models/User");
const Role = require("../models/Role");
const Report = require('../models/Report');
const Favorite = require('../models/Favorite');
const Job = require('../models/Job');
const Feedback = require('../models/Feedback');
const CV = require('../models/CV');
const { mongo } = require("mongoose");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAllUsers = async (req, res) => {
  try {
    // Find the "user" role ID
    const userRole = await Role.findOne({ name: "user" });
    console.log("User Role:", userRole); // Log to verify user role
    if (!userRole) {
      return res.status(404).json({ message: "Role 'user' not found" });
    }

    // Find all users with this role
    const users = await User.find({ role: userRole._id });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error); // Log the error for debugging
    res.status(500).json({ message: "Error retrieving users with 'user' role", error });
  }
};

const getAllEmployers = async (req, res) => {
  try {
    // Find the "user" role ID
    const userRole = await Role.findOne({ name: "employer" });
    console.log("User Role:", userRole); // Log to verify user role
    if (!userRole) {
      return res.status(404).json({ message: "Role 'user' not found" });
    }

    // Find all users with this role
    const users = await User.find({ role: userRole._id });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error); // Log the error for debugging
    res.status(500).json({ message: "Error retrieving users with 'user' role", error });
  }
};

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

const getUserProfession = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getProfileUserProfession(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profession" });
  }
};

// Controller to update username by user ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, professionId, jobInput  } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, professionId, jobInput },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      username: updatedUser.username,
      professionId: updatedUser.professionId,
    });
  } catch (error) {
    console.error("Error updating user:", error); 
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
    const { introduction, userId } = req.body;
    const jobId = req.query.jobId;

    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được tải lên.' });
    }

    const newApplication = new Application({
      introduction,
      userId,
      cv: req.file.buffer, // Lưu buffer của file
      jobId,
    });
    console.log('New application: ', newApplication);

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

//get sl cviec va tg cap nhat
const getJob_updateTime = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const updatedAt = new Date();

    res.json({
      positions: totalJobs,
      updatedAt: updatedAt
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//feedback
const addFeedback = async (req, res) => {
  try {
    const { userId, feedbackName, description } = req.body;
    const createdAt = new Date();
    const feedback = new Feedback({ userId, feedbackName, description, createdAt });
    await feedback.save();
    res.status(201).send({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedback listings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getNoficationByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }); // Sort by latest notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const setNoficationRead = async (req, res) => {
  const { userId } = req.params;

  try {
    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// luu cv:
const saveCV = async (req, res) => {
  try {
    const newCV = new CV(req.body);
    const savedCV = await newCV.save();
    res.status(201).json({ message: 'CV is saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save a new CV!' });
  }
};

const getCvByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cvList = await CV.find({ userId });

    if (!cvList || cvList.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy CV nào cho userId này' });
    }

    const cvListWithBase64Avatar = cvList.map(cv => {
      if (cv.personalInfo.avatar && cv.personalInfo.avatar.data) {
        const base64Avatar = cv.personalInfo.avatar.data.toString('base64'); 

        console.log('Base64 Avatar: ', base64Avatar);

        return {
          ...cv.toObject(), 
          personalInfo: {
            ...cv.personalInfo,
            avatar: `data:image/png;base64,${base64Avatar}` 
          }
        };
      }
      return cv;
    });
    console.log('CV List with Base64 Avatar: ', cvListWithBase64Avatar);

    res.status(200).json(cvListWithBase64Avatar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách CV' });
  }
};

//detail cv byid
const getDetailedCVById = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({ message: 'CV không tìm thấy' });
    }
    res.json(cv);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết CV:', error);
    res.status(500).json({ message: 'Lỗi khi lấy CV', error });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    res.status(500).json({ message: "Error retrieving user by ID", error });
  }
};

// xoa cv theo id:
const deleteCvById = async (req, res) => {
  try {
      const cvId = req.params.id;
      const deletedCV = await CV.findByIdAndDelete(cvId);

      if (!deletedCV) {
          return res.status(404).json({ message: 'CV không tìm thấy!' });
      }

      return res.status(200).json({ message: 'CV đã được xóa thành công!' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server!' });
  }
};

const getApplicationByUserId = async (req, res) => {
  try {
      const { userId } = req.params;
      const applications = await Application.find({ userId }).populate('jobId'); 
      res.json(applications);
  } catch (error) {
      console.error("Lỗi lấy danh sách ứng tuyển:", error);
      res.status(500).json({ message: "Không thể lấy danh sách ứng tuyển" });
  }
};

const toggleUserBlockStatus = async (req, res) => {
  const userId = req.params.id;

  try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Toggle the isBlock status (flip its current value)
      user.isBlock = !user.isBlock;

      // Save only the updated field for efficiency
      await user.save();

      // Return a success response with updated user details
      return res.status(200).json({
          message: `User isBlock status updated to ${user.isBlock ? "true" : "false"}`,
          user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              isBlock: user.isBlock, // Include the updated status
          },
      });
  } catch (error) {
      console.error("Error toggling isBlock status:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUserById, getAllEmployers, getAllUsers ,setNoficationRead, getNoficationByUser, getProfileUser, updateUser, createReport, applyJob, markFavorite, getFavorite, deleteFavorite, getJob_updateTime, addFeedback, toggleUserBlockStatus, getApplicationByUserId, deleteCvById, getUserProfession, getDetailedCVById, saveCV, getCvByUserId, getFeedback};
