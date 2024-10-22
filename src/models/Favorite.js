const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    createdAt: { 
        type: Date,
        default: Date.now, 
    },
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
