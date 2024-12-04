const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/COLLEGE STUFF/Sem 5/microservices/ChatApp/Uploads/ProfilePic'); // Specify the directory to save files
    },
    filename: (req, file, cb) => {
        const username = req.body.username; // Get the username from the request body
        cb(null, `${username}${path.extname(file.originalname)}`); // Save as username.extension
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;