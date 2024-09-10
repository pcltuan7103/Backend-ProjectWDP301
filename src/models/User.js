const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // Nếu bạn không muốn `username` là duy nhất, hãy bỏ qua hoặc xóa dòng `unique: true`
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Đảm bảo email là duy nhất
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
