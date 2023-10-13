const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken")
// const cookie=require("cookie-parser")
require("dotenv").config()
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const mailSender = require("../utils/mailSender")

//sendOTP
exports.sendOTP = async (req, res) => {
    try {

        //fetch email from req body
        const { email } = req.body;

        //check if user already exists
        const checkUserPresent = await User.findOne({ email });

        // if user already exists
        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            })
        }
        // generate otp 
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        //check unique otp or not
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
               
            })
            // result = await OTP.findOne({ otp: otp });
        }
        // this is not a traditonal payload just a normal variable store of different values in otp payload variable and then send it to the create post method
        const otpPayload = { email, otp };
        //create an entry in DB

        const otpBody = await OTP.create(otpPayload);

        //return response
        res.status(200).json({
            success: true,
            message: "Otp Send Successfully",
            otpBody
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

//signup

exports.signUp = async (req, res) => {
    try {

        //data from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body

        //validation of data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).send({
                success: false,
                message: "All fields are required"
            })
        }

        //match confirm and create password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password doesn't match"
            })
        }

        //if user exist or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already Registered."
            })
        }

        //find most recent otp for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)

        //validate otp
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP "
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // // Create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);


        //create prpfile

        const profileDetails = await Profile.create({
            gender: null,
            dataOfBirth: null,
            about: null,
            contactNumber: null 
        })

        //create db entry
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType:accountType,
            contactNumber,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}&${lastName}`
        })
        //return res
        return res.status(200).json({
            success: true,
            message: "User Registered Sucessfully",
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User can't be registered. Please try again "
        })
    }
}

//login

exports.login = async (req, res) => {
    try {
        //get data from req body
        const { email, password } = req.body

        //validation of data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All Fields are required"
            })
        }
        // if user is registered or not
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered. Please Signup "
            })
        }
        //match password if user exist then generate jwt token
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h"
            })
            user.token = token;
            user.password = undefined;
        
            //create cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Password is Incorrect"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login Failure. Please try again"
        })
    }
}

//changePassword

exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);
        //get data from req body
        const { oldPassword, newPassword} = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        //get oldpwd,newpassword and confirm password

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            })
        }


        //update pwd in DB
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: hashedPassword },
            { new: true }
        );
        //sendmail
        // Send notification email
        // console.log("updatedUserDetails");

        try {
            const emailResponse = await mailSender(
              updatedUserDetails.email,
              "Password for your account has been updated",
              passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
              )
            )
            // console.log("Email sent successfully:", emailResponse.response)
          } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }
        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset is Successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try to reset your Password again."
        })
    }
}