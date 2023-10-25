const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt=require("bcrypt")
const crypto=require("crypto")
//resetPwdToken

exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req.body
        const email = req.body.email;
        //check user from email, email validation
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({
                message: "Your email is not registered with us"
            })
        }

        //generate token
        const token = crypto.randomBytes(20).toString("hex");

        //update user by adding token  and expiration time
        const updatedDetails = await User.findOneAndUpdate({ email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() +3600000
            }, { new: true }) //newLtrue returns you the updated value after updaing the token andresetpasswordexpires time

        //create url
        const url = `https://itstudent.in/update-password/${token}`

        //send mail containing url
        await mailSender(email, "Password Reset Link", `Password Reset Link : ${url}`)

        //return response
        return res.json({
            success: true,
            message: "Email Sent Successfully, please check email and change password",
            updatedDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong while resetting the password"
        })
    }
}

//reset password for user
exports.resetPassword=async(req,res)=>{
    try {
        //data fetch
        //here token is not in req.body but in front end react we will send the token
        const{password, confirmPassword, token}=req.body

        //validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "Password not Matching"
            })
        }

        //get user Details from db using token
        const userDetails= await User.findOne({token:token});

        //if no entry found then invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: "Token is Invalid"
            })
        }

        //token time check - It means when the password expire time is 5.05pm and date.now is 6pm so it is more than 5 minutes so it expires
        if(!(userDetails.resetPasswordExpires > Date.now())){
            return res.status(403).json({
                success: false,
                message: "Token is Expired and please regenerate your Token"
            })
        }

        //hash pwd
        const hashedPassword=await bcrypt.hash(password,10)

        //password update
        await User.findOneAndUpdate({token:token},{
            password:hashedPassword
        },{new:true})

        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset is Successfull"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Something went wrong while resettinhg the password"
        })
    }
}
