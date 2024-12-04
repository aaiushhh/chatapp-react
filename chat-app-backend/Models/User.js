const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: "Hey there! I'm using Echo Verse" },
    profilePic: { type: String, 
        default: '/Uploads/ProfilePic/user.png' 
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
