const jwt=require("jsonwebtoken");
// const user=require("../Models/User");
const User = require("../Models/User");

const protect=async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        
        try {
            // console.log(req.headers.authorization)
            token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await User.findById(decoded._id).select("-password")
            // console.log('Authenticated User:', req.user)
            next();
        } catch (error) {
            console.error('Token Error:', error)
            res.status(401).json({
                success: false,
                message: "Not authorized, token failed"
            })
        }
    } else{
        res.status(401).json({
            success: false,
            message: "Not authorized, no token"
        })
    }
}

module.exports=protect