require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookie_parser = require("cookie-parser");
const connection = require("./config/database");
const jwt = require('jsonwebtoken');
const authRoutes = require("./routes/authApi");
const userRoutes = require("./routes/userApi");
const companyRoutes = require("./routes/companyApi");
const Role = require("./models/Role");
const guestRouter = require("./routes/guestRouter");
const recruiterRouter = require("./routes/recruiterRouter");
const adminRouter = require("./routes/adminRouter");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(cookie_parser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const API_KEY = 'SK.0.PVvFR0TzCjqDBWZIXoHRKmK1XnZckXl7';
const API_SECRET = 'aGRkcU54cE9wMWZydzRyTnEycGFwSzdKekdYZTU3MXY=';

const jobSeekerId = 'jobseeker';
const employerId = 'employer';

//Routes
app.use("/v1/api/", authRoutes);
app.use("/v1/api/users", userRoutes);
app.use("/company/", companyRoutes);
app.use("/", guestRouter);
app.use("/", recruiterRouter);
app.use("/v1/api/admin", adminRouter);

app.get('/getAccessTokenForJobSeeker', (req, res) => {
    try {
        // Lấy thời gian hiện tại và thời gian hết hạn của token (1 giờ)
        const now = Math.floor(Date.now() / 1000);  // Thời gian hiện tại (tính bằng giây)
        const exp = now + 3600;  // Token hết hạn sau 1 giờ
        // Định nghĩa payload (dữ liệu) của token
        const header = {
            cty: "stringee-api;v=1"  // Định dạng header theo yêu cầu của Stringee
        };
        const payload = {
            jti: `${API_KEY}-${now}`,  // ID của token
            iss: API_KEY,              // Issuer (người phát hành) là API Key Sid của bạn
            exp: exp,                    // Thời gian hết hạn của token
            userId: jobSeekerId               // Thông tin ID của người dùng (userId)
        };
        // Tạo token sử dụng thư viện jsonwebtoken
        const token = jwt.sign(payload, API_SECRET, { algorithm: 'HS256', header: header });
        // Trả về token dưới dạng JSON
        res.json({ accessToken: token });
    } catch (error) {
        console.error('Lỗi khi tạo access token:', error);
        res.status(500).json({ error: 'Lỗi khi tạo access token' });
    }
});

app.get('/getAccessTokenForEmployer', (req, res) => {
    try {
        const now = Math.floor(Date.now() / 1000); 
        const exp = now + 3600;  
        const header = {
            cty: "stringee-api;v=1"  
        };
        const payload = {
            jti: `${API_KEY}-${now}`, 
            iss: API_KEY,           
            exp: exp,                   
            userId: employerId            
        };
        const token = jwt.sign(payload, API_SECRET, { algorithm: 'HS256', header: header });
        res.json({ accessToken: token });
    } catch (error) {
        console.error('Lỗi khi tạo access token:', error);
        res.status(500).json({ error: 'Lỗi khi tạo access token' });
    }
});

(async () => {
    try {
        await connection();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();
