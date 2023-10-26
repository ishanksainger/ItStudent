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
<<<<<<< HEAD
  getAllUsers,
=======
>>>>>>> 363b646 (Your commit message)
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, isStudent, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.get("/getUsers", getAllUsers)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
router.get("/adminDashboard", auth, isAdmin, adminDashboard)
<<<<<<< HEAD

=======
>>>>>>> 363b646 (Your commit message)
module.exports = router