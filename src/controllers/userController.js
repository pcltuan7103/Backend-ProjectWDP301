const {
  getProfileUserService,
  updateUserService,
} = require("../services/userService");
const User = require("../models/User");

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

module.exports = {
  getProfileUser,
  updateUser,
};
