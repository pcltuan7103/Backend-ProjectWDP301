const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    number_of_employee: {
        type: Number,
    },
    introduction: {
        type: String,
    },
    location: {
        type: String,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Company", CompanySchema);
