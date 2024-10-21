const mongoose = require('mongoose');

const ProfessionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Profession', ProfessionSchema);