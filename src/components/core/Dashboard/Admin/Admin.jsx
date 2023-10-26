import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminData,
  getAllUsersDetails,
} from "../../../../services/operations/profileAPI";
import InstructorChart from "../InstructorDashboard/InstructorChart";
import { getAllCourses } from "../../../../services/operations/courseDetailsAPI";
import IconBtn from "../../../common/IconBtn";
=======
import { Link } from "react-router-dom";
import { getAdminData} from "../../../../services/operations/profileAPI";
import InstructorChart from "../InstructorDashboard/InstructorChart";
import { getAllCourses } from "../../../../services/operations/courseDetailsAPI";
>>>>>>> 363b646 (Your commit message)

// Hi i am the change

export default function Admin() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [adminData, setAdminData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      const adminApiData = await getAdminData(token);
      const result = await getAllCourses();
      const allUsers = await getAllUsersDetails();
      if (allUsers) {
        const studentCount = allUsers.filter(
          (user) => user.accountType === "Student"
        ).length;
        const instructorCount = allUsers.filter(
          (user) => user.accountType === "Instructor"
        ).length;
        setStudents(studentCount);
        setInstructors(instructorCount);
      }
      if (adminApiData.length) setAdminData(adminApiData);
=======
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await getAdminData(token);
      const result = await getAllCourses(token);
      if (instructorApiData.length) setInstructorData(instructorApiData);
>>>>>>> 363b646 (Your commit message)
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    })();
  }, []);

<<<<<<< HEAD
  const totalAmount = adminData?.reduce(
=======
  const totalAmount = instructorData?.reduce(
>>>>>>> 363b646 (Your commit message)
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

<<<<<<< HEAD
  const totalStudents = adminData?.reduce(
=======
  const totalStudents = instructorData?.reduce(
>>>>>>> 363b646 (Your commit message)
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="p-4 md:p-8">
      <div className="space-y-4 md:space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="text-md md:text-base font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 md:my-8 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
<<<<<<< HEAD
              <InstructorChart courses={adminData} />
=======
              <InstructorChart courses={instructorData} />
>>>>>>> 363b646 (Your commit message)
            ) : (
              <div className="flex-1 md:w-1/2 rounded-md bg-richblack-800 p-6">
                <p className="text-lg md:text-xl font-bold text-richblack-5">
                  Visualize
                </p>
                <p className="mt-4 text-md md:text-lg font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="min-w-[250px] md:w-full flex flex-col rounded-md bg-richblack-800 p-6 md:flex-col">
              <p className="text-lg md:text-xl font-bold text-richblack-5">
                Statistics
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-md md:text-lg text-richblack-200">
                    Total Courses
                  </p>
                  <p className="text-xl md:text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-md md:text-lg text-richblack-200">
                    Total Students
                  </p>
                  <p className="text-xl md:text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-md md:text-lg text-richblack-200">
                    Total Income
                  </p>
                  <p className="text-xl md:text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 courses */}
            <div className="flex items-center justify-between">
<<<<<<< HEAD
              <p className="text-4xl md:text-xl font-bold text-richblack-5">
                Database Statistics
              </p>
            </div>
            <div className="my-4 flex flex-col md:flex-row justify-between text-3xl  items-start space-y-6 md:space-y-0 md:space-x-6 text-white">
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex justify-center items-center">
                  <p>Total Students: </p>
                  <span className="ml-2">{students}</span>
                </div>
                <IconBtn
                  text="See More"
                  onClick={() => navigate("/dashboard/all-students")}
                />
              </div>
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex justify-center items-center">
                  <p>Total Instructors: </p>
                  <span className="ml-2">{instructors}</span>
                </div>
                <IconBtn
                  text="See More"
                  onClick={() => navigate("/dashboard/all-instructors")}
                />
              </div>
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex justify-center items-center">
                  <p>Total Courses: </p>
                  <span className="ml-2">{courses.length}</span>
                </div>
                <IconBtn
                  text="See More"
                  onClick={() => navigate("/dashboard/all-courses")}
                />
              </div>
=======
              <p className="text-lg md:text-xl font-bold text-richblack-5">
                Your Courses
              </p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs md:text-md font-semibold text-yellow-50">
                  View All
                </p>
              </Link>
            </div>
            <div className="my-4 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full md:w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3">
                    <p className="text-md font-medium text-richblack-50">
                      {course.courseName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-md font-medium text-richblack-300">
                        {course.studentsEnrolled.length} students
                      </p>
                      <p className="text-md font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-md font-medium text-richblack-300">
                        Rs. {course.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
>>>>>>> 363b646 (Your commit message)
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 md:mt-20 rounded-md bg-richblack-800 p-6 py-8">
          <p className="text-lg md:text-2xl text-center font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-4 md:mt-6 text-center text-base md:text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
