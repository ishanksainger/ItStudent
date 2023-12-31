const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body


    //get userid
    const id = req.user.id

    //validation
    if (!contactNumber || !gender) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }
    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    
    // Save the updated profile
    await profile.save()

    const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec()
    // profileDetails.dataOfBirth=dateofBirth
    // profileDetails.about=about
    // profileDetails.gender=gender
    // profileDetails.contactNumber=contactNumber
    // await profileDetails.save()

    //return response
    res.status(200).json({
      success: true,
      message: "Profile created successfully",
      updatedUserDetails
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//delete account


// // Function to schedule the deletion
// async function scheduleDeletion(userId, profileId) {
//   // Calculate the delay in minutes (5 days * 24 hours * 60 minutes)
//   const delayInMinutes = 1 //5 * 24 * 60;

//   // Schedule the deletion task to run at the specified delay
//   cron.schedule(`*/${delayInMinutes} * * * *`, async () => {
//     // Delete the profile
//     await Profile.findByIdAndDelete({ _id: profileId });

//     // Delete the user
//     await User.findByIdAndDelete({ _id: userId });

//     // Stop the cron job after it runs once
//     this.stop();
//   }, {
//     scheduled: true,
//     timezone: 'Asia/Kolkata' // Set to 'Asia/Kolkata' for New Delhi (IST) timezone
//   });
// }


exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id

    //validation
    const userDetails = await User.findById(id)
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
    })
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }

    // Now Delete User
    await User.findByIdAndDelete({ _id: id })

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.deleteStudentAccount = async (req, res) => {
  try {
    //get id
    const id = req.body.userId;
    console.log(id);
    //validation
    const userDetails = await User.findById(id)
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
    })
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }

    // Now Delete User
    await User.findByIdAndDelete({ _id: id })

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//get all the details of user

exports.getAllUserDetails = async (req, res) => {
  try {
    //get user id
    const id = req.user.id

    //validation
    const userDetails = await User.findById(id).populate("additionalDetails").populate("courses").exec()
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    //return respomse
    res.status(200).json({
      success: true,
      message: "User data fetched Successfully",
      data: userDetails,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImagetoCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    
   
    let userDetails = await User.findOne({
      _id: userId,
    })
    .populate({
      path: "courses",
      populate: {
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      },
    })
    .exec()
 
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};


exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

exports.adminDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find()

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
// Server-Side Code
exports.getAllUsers = async (req, res) => {
  try {
    const userDetails = await User.find().populate("additionalDetails").exec();

    if (userDetails.length === 0) {
      console.log("No users found");
      return res.status(404).json({
        success: false,
        message: "No Users found",
      });
    }
    // Return response
    res.status(200).json({
      success: true,
      message: "User data fetched Successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error in /getUsers route:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
