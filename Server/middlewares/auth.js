const jwt=require("jsonwebtoken")
require("dotenv").config()
const User=require("../models/User")

//auth
exports.auth=async(req,res,next)=>{
    try {
        //extract token
        const token=req.cookies.token || req.body.token ||req.headers.authorization.replace("Bearer ", "");

        // if token is missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }
        //verify token

        try {
            const decode=await jwt.verify(token,process.env.JWT_SECRET)
        // this req.user is getting  the data we got while saving token in payload and then we put in decode and send it to user in req.user. However we can name it anything req.user or req.currentuser its
        // just a req that will show after hitting api and we can use it further as well 
            req.user=decode
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating"
        })
    }
}
//isStudent
exports.isStudent=async(req,res,next)=>{
    try {
        //req.user.accountype has the user account type data and it is passed from previous auth midddleware where we put decode details in req.user and then did next so now the details passed to this.
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students Only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User Role can't be verified. Please try again"
        })
    }
}

//isInstructor
exports.isInstructor=async(req,res,next)=>{
    try {
        //req.user.accountype has the user account type data and it is passed from previous auth midddleware where we put decode details in req.user and then did next so now the details passed to this.
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor Only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User Role can't be verified. Please try again"
        })
    }
}

//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try {
        //req.user.accountype has the user account type data and it is passed from previous auth midddleware where we put decode details in req.user and then did next so now the details passed to this.
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin Only"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User Role can't be verified. Please try again"
        })
    }
}