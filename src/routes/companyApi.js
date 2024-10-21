const express = require("express");
const {
    getCompany,
    createCompany,
} = require("../controllers/companyController");

const routerApi = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads/logos");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

routerApi.get("/get/:userId", getCompany);
routerApi.post("/create",upload.single("logo"), createCompany);

module.exports = routerApi;
