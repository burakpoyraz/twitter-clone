import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectRoute = async (req, res, next) => { 
    try{

        const token=req.cookies.jwt;

        if(!token){
            return res.status(401).json({error:"token: You need to login first"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error:"decoded: You need to login first"});
        }

        const user=await User.findById(decoded.userId);

        if(!user){
            return res.status(401).json({error:"user: You need to login first"});
        }

        req.user=user;
        next();

    }
    catch(err){
        console.log("Error in protectRoute",err.message);
        res.status(500).json({error:"Internal Server Error "+err.message});
    }

}