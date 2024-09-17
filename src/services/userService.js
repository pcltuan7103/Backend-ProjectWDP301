const User = require("../models/User");

const getProfileUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("User not found");
  }
};

// Service to update the username by user ID
const updateUserService = async (userId, newUsername) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // If user is not found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Update the username with the new value
    user.username = newUsername;

    // Save the updated user object
    await user.save();

    return user; // Return the updated user object
  } catch (error) {
    throw new Error(error.message); // Throw any errors to the controller
  }
};

module.exports = {
  getProfileUserService,
  updateUserService,
};
