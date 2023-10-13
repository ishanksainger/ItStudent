const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    },
})


//send otp mail
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email,
            "Verification Email from IT Student", emailTemplate(otp))
    } catch (error) {
        console.log("Error ocurred while sending mail", error);
        throw error
    }
}
// this means before the otp could be saved in the database we need to send it to the user to verify and once done it can be saved
OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp)
    }
    // this means once done then we can proceed with next middleware and save the data to the db
    next()
})
// pre or post hook middleware decide that where they should be run exports line doesnt effect the saving of the data base pre and post keyword does
module.exports = mongoose.model("OTP", OTPSchema);