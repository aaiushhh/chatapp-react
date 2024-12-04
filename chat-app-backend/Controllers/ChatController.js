const Chat = require('../Models/chatModel');
const User = require('../Models/User');

const accessChats = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(404), json({
                success: false,
                message: "UserId not provided"
            })
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } }, },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "username profilePic email"
        })

        if (isChat.length > 0) {
            res.status(200).json({
                success: true,
                chat: isChat[0]
            });

        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
                res.status(200).json({
                    success: true,
                    chat: fullChat
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: error, success: false });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error, success: false });
    }
}

const fetchChats = async (req, res) => {
    try {
        Chat.find({
            users:{$elemMatch:{$eq:req.user._id}}
        }).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"username profilepic email"
            });
            // console.log("HERE",results)
            res.status(200).json({
                success:true,
                chat:results
            })
        })
        .catch((error)=>{
            res.status(500).json({ message: error, success: false });
        });
    } catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

const createGroupChat=async(req,res)=>{
    if (!req.body.users || !req.body.name){
        return res.status(400).json({ message: "Please Select Users", success: false });
    }

    var users=JSON.parse(req.body.users);
    if (users.length<2){
        return res.status(400).json({ message: "More than 2 users are required to form a group", success: false });
    }
    users.push(req.user);
    try {
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })

        const fullGroupChat=await Chat.findOne({_id:groupChat._id})
        .populate("users","-password").populate("groupAdmin","-password");

        res.status(200).json({
            success:true,
            chat:fullGroupChat
        })

    } catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

const renameGroup=async(req,res)=>{
    try {
        const  {chatId,chatName}=req.body;
        const updatedChat=await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName:chatName
            },
            {
                new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
            throw new Error("Chat Not Found")
        }else{
            res.status(200).json({
                success:true,
                chat:updatedChat
            })
        }
    } catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

const addToGroup=async(req,res)=>{
    try {
        const {chatId,userId}=req.body;
        const added=await Chat.findByIdAndUpdate(
            chatId,{
                $push:{users: userId},
            },
            {new:true}
        ).populate("users","-password")
        .populate("groupAdmin","-password");
        
        if(!added){
            throw new Error("Chat Not Found")
        }else{
            res.status(200).json({
                success:true,
                chat:added
            })
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message || error, success: false });
    }
}

const removeFromGroup=async(req,res)=>{
    try {
        const {chatId,userId}=req.body;
        const removed=await Chat.findByIdAndUpdate(
            chatId,{
                $pull:{users: userId},
            },
            {new:true}
        ).populate("users","-password")
        .populate("groupAdmin","-password");
        
        if(!removed){
            throw new Error("User Not Found")
        }else{
            res.status(200).json({
                success:true,
                chat:removed
            })
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message || error, success: false });
    }
}
module.exports = { accessChats, fetchChats , createGroupChat,renameGroup,addToGroup,removeFromGroup }