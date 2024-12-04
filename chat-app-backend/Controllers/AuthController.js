const User = require("../Models/User")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const path = require('path');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" }); //409 conflict
        }

        const userModel = new User({ email, username, password })
        userModel.password = await bcrypt.hash(password, 10)
        await userModel.save();
        res.status(201).json({ message: "User created successfully", success: true })
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(409).json({ message: "User doesn't exists" }); //409 conflict
        }

        if (await bcrypt.compare(password, user.password)) {
            const token=jwt.sign(
                {
                    _id:user._id,
                    email:user.email,
                },
                process.env.JWT_SECRET)
                console.log(user)
            res.status(201).json({ 
                message: "User logged in successfully", 
                success: true,
                token:token,
                email:user.email,
                username:user.username,
                bio:user.bio,
                _id:user._id
               
             })
        } else {
            res.status(401).json({ message: "Invalid password", success: false })
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const { bio, email, username } = req.body; // Get bio, email, and username from request body
        const user = await User.findOne({ email });

        if (user) {
            // Update bio if provided
            if (bio) {
                user.bio = bio;
            }

            // Update username if provided
            if (username) {
                user.username = username;
            }

            // Update profile picture if provided
            if (req.file) {
                user.profilePic = `/Uploads/ProfilePic/${username}${path.extname(req.file.originalname)}`; // Save the relative URL
            }

            await user.save(); // Await the save operation
            res.status(200).json({
                message: "User profile updated successfully",
                success: true,
                bio: user.bio,
                username: user.username,
                profilePic: user.profilePic // Return the updated profile picture URL
            });
        } else {
            return res.status(404).json({ message: "User not found", success: false });
        }
    } catch (error) {
        console.error('Update User Profile Error:', error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const alluser = async (req, res) => {
    try {
        const searchUser = req.query.search ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        const users = await User.find(searchUser)
            .find({ _id: { $ne: req.user._id } })
            .select('-password');
        console.log(users);
        res.status(200).json({
            users: users,
            success: true
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = { signup, login, updateUserProfile , alluser}