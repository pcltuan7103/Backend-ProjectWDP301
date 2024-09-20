require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookie_parser = require("cookie-parser");
const connection = require("./config/database");
const authRoutes = require("./routes/authApi");
const userRoutes = require("./routes/userApi");
const Role = require("./models/Role");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(cookie_parser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data

//Routes
app.use("/v1/api/", authRoutes);
app.use("/v1/api/users", userRoutes);

(async () => {
  try {
    //using mongoose
    await connection();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
