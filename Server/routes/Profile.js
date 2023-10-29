const express = require("express")
const router = express.Router()
const { auth, isStudent, isInstructor, isAdmin } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
  adminDashboard,
  getAllUsers,
  deleteStudentAccount,
  getAllUsers,
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, isStudent, deleteAccount)
router.delete("/deleteStudent", deleteStudentAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.get("/getUsers", getAllUsers)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
router.get("/adminDashboard", auth, isAdmin, adminDashboard)

module.exports = router