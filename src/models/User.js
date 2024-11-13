const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    professionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profession", 
      default: null
    },
    jobInput: {
      type: String,
      default: null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
