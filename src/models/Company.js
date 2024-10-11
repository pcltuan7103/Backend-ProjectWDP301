const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    number_of_employee: {
        type: Number
    },
    introduction: {
        type: String
    },
    location: {
        type: String
    }
});

module.exports = mongoose.model('Company', CompanySchema);