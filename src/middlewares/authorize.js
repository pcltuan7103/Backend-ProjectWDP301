const User = require("../models/User");

const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Access token required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;

      // Ensure the user exists in the database
      const user = await User.findById(req.user.id).populate("role");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check role access
      if (roles.length && !roles.includes(user.role.name)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = authorize;
