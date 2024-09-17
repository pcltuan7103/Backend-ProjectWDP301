const {
  getProfileUserService,
  updateUserService,
} = require("../services/userService");

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
    const { userId, newUsername } = req.body;

    // Validate input
    if (!userId || !newUsername) {
      return res
        .status(400)
        .json({ message: "User ID and new username are required" });
    }

    // Call the service to update the username
    const updatedUser = await updateUserService(userId, newUsername);

    // Respond with the updated user object
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfileUser,
  updateUser,
};
