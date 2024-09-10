const {
  registerUserService,
  registerEmployerService,
  loginService,
  refreshAccessToken,
  logoutService,
} = require("../services/authService");

const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Gọi service để thực hiện logic đăng ký người dùng
    const data = await registerUserService(email, password, username);

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

const registerEmployer = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Gọi service để thực hiện logic đăng ký người dùng
    const data = await registerEmployerService(email, password, username);

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

module.exports = {
  registerUser,
  login,
  registerEmployer,
  refreshToken,
  logout,
  getAccount,
};
