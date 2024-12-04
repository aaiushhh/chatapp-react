const express = require('express');
const router = express.Router();
const { signup, login, updateUserProfile, alluser } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const upload = require('../Middlewares/multerConfig'); // Import multer config
const path = require('path');
const fs = require('fs');
const protect = require('../Middlewares/authMIddleware');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.put('/update-profile', upload.single('profilePic'), updateUserProfile);

router.get('/profilepic/:username', (req, res) => {
    const username = req.params.username;
    const filePath = path.join(__dirname, '../Uploads/ProfilePic', `${username}.jpeg`); // Adjust the extension as needed

    const possibleExtensions = ['.jpeg', '.jpg', '.png'];
    let found = false;

    for (const ext of possibleExtensions) {
        const fullPath = path.join(__dirname, '../../Uploads/ProfilePic', `${username}${ext}`);
        // console.log(fullPath)
        if (fs.existsSync(fullPath)) {
            found = true;
            return res.sendFile(fullPath, (err) => {
                if (err) {
                    fullPath="../../Uploads/ProfilePic/user.png"
                    console.error('Error sending file:', err);
                    res.status(404).sendFile(filePath);
                }
            });
        }
    }

    if (!found) {
        fullPath=path.join(__dirname, '../../Uploads/ProfilePic', `user.jpeg`);
        // console.log("error",fullPath)
        return res.status(200).sendFile(fullPath);
    }
});

router.get('/getuser', protect, alluser);
module.exports = router;