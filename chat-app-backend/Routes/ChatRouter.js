const express = require('express');
const protect = require('../Middlewares/authMIddleware');
const router = express.Router();
const {accessChats,fetchChats,createGroupChat, renameGroup,addToGroup,removeFromGroup} =require('../Controllers/ChatController')
router.route('/')
    .get(protect, fetchChats)
    .post(protect, accessChats)

router.post("/group", protect, createGroupChat);
router.put('/rename', protect, renameGroup);
router.put('/groupremove', protect, removeFromGroup);
router.put('/groupadd',protect,addToGroup)

module.exports = router;