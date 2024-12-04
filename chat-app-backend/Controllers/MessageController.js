const Chat = require('../Models/chatModel');
const Message=require('../Models/messageModel');
const User = require('../Models/User');


const sendMessage=async(req,res)=>{
    const {content,chatId}=req.body;
    if (!content || !chatId){
        console.error("Invaid data provided")
        return res.status(400).json({ message: "Invalid data", success: false });
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat: chatId,
    };

    try {
        var message= await Message.create(newMessage);
        message=await message.populate("sender","username profilePic");
        message=await message.populate("chat");

        if (!message.chat) {
            return res.status(404).json({ message: "Chat not found", success: false });
        }

        message=await User.populate(message,{
            path:"chat.users",
            select:"username profilePic email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        });

        res.status(200).json({ chat:message , success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, success: false });
    }
}

const allMessage=async(req,res)=>{
    try {
        const messages=await Message.find({chat:req.params.chatId}).populate(
            "sender",
            "username profilePic email").populate("chat")
            res.status(200).json({ chat:messages , success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

module.exports={sendMessage,allMessage}