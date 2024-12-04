const express = require('express');
const protect = require('../Middlewares/authMIddleware');
const router = express.Router();
const {sendMessage,allMessage}=require('../Controllers/MessageController')
router.route("/").post(protect,sendMessage)
router.route("/:chatId").get(protect,allMessage)

module.exports = router;