import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/common/NavBar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import Settings from "./components/core/Dashboard/Settings";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import Contact from "./pages/Contact";
import AddCourse from "./components/core/Dashboard/AddCourse";
import Catalog from "./pages/Catalog";
import EditCourse from "./components/core/Dashboard/EditCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import { getUserDetails } from "./services/operations/profileAPI";
import { useEffect } from "react";
import Instructor from "./components/core/Dashboard/Instructor";
import Admin from "./components/core/Dashboard/Admin/Admin";
import AllCourses from "./components/core/Dashboard/Admin/AllCourses";
import AllStudents from "./components/core/Dashboard/Admin/AllStudents";
import AllInstructors from "./components/core/Dashboard/Admin/AllInstructors";
import AllCategories from "./components/core/Dashboard/Admin/AllCategories";
import AddCategory from "./components/core/Dashboard/Admin/AddCategory";

function App() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"));
      dispatch(getUserDetails(token, navigate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        {/* <Route path='/courses/:courseId' element={<CourseDetails />} /> */}
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />


          {/* Route only for Admin */}

          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="dashboard/admin" element={<Admin />} />
              <Route path="/dashboard/course-category" element={<AllCategories/>} />
              <Route path="/dashboard/all-courses" element={<AllCourses />} />
              <Route path="/dashboard/all-users" element={<AllStudents />} />
              <Route path="/dashboard/addcategory" element={<AddCategory />} />
              <Route
                path="/dashboard/all-instructors"
                element={<AllInstructors />}
              />
            </>
          )}

             {/* Route only for Admin */}

             {user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path="dashboard/admin" element={<Admin/>} />
                {/* <Route path="/dashboard/add-category" element={< />} />
                <Route path="/dashboard/all-courses" element={< />} />
                <Route path="/dashboard/all-users" element={< />} />
                <Route path="/dashboard/all-instructors" element={< />} /> */}
              </>
            )}


          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}

          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          <Route path="dashboard/settings" element={<Settings />} />
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              ></Route>
            </>
          )}
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
