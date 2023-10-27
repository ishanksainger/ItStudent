import React from "react";
import { getAllCourses } from "../../../../services/operations/courseDetailsAPI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { formatDate } from "../../../../services/formatDate";
import "tailwindcss/tailwind.css";
import { useEffect } from "react";

const AllCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const TRUNCATE_LENGTH = 30;

  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      const result = await getAllCourses();
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    fetchAllCourses();
  }, []);

  const paginate = (courses, currentPage, coursesPerPage) => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return courses.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedCourses = paginate(courses, currentPage, coursesPerPage);

  const calculateTotalDuration = (courses) => {
    let totalMinutes = 0;

    // Iterate through sections
    for (const section of courses.courseContent) {
      // Calculate the duration of the section in minutes
      const sectionMinutes = section.subSection.reduce((acc, subsection) => {
        const [minutes, seconds] = subsection.timeDuration
          .toString()
          .split(".");
        const fractionalMinutes = seconds ? parseFloat(`0.${seconds}`) : 0;
        return acc + parseFloat(minutes) + fractionalMinutes;
      }, 0);

      totalMinutes += sectionMinutes;
    }

    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    // Format the total duration as "hr min"
    const formattedTotalDuration = `${hours}hr ${minutes}min`;

    return formattedTotalDuration;
  };

  return (
    <>
      <Table className="rounded-xl border border-richblack-600 responsiveTableDisable">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-600 px-6 py-2">
            <Th className="flex-1 lg:flex-2 md:flex-1 sm:flex-1 text-center text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-right text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-right text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            paginatedCourses.map((course) => (
              <Tr
                key={course._id}
                className="flex flex-col sm:flex-row md:flex-row md:justify-evenly lg:flex-row gap-x-10 border border-richblack-600 px-6 py-8 responsiveTableCustom"
              >
                <Td className="flex md:flex-col sm:flex-col lg:flex-row  items-center sm:items-start md:items-start lg:items-start gap-y-2 sm:gap-x-4 md:gap-x-4 lg:gap-x-4">
                  <img
                    src={course?.thumbnail}
                    className="h-[148px] w-[220px] sm:w-[148px] md:w-[148px] lg:w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col sm:gap-y-1 md:gap-y-1 lg:gap-y-1">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course?.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course?.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course?.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course?.courseDescription}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {formatDate(course?.createdAt)}
                    </p>{" "}
                    {course?.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        {course?.status}
                      </p>
                    ) : (
                      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        {course?.status}
                      </div>
                    )}
                  </div>
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {" "}
                  {calculateTotalDuration(course)}
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {course?.price}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <div className="pagination  my-[20px] mx-auto w-fit text-white ">
        {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button text-3xl w-12 ${
                currentPage === index + 1 ? " border border-richblack-600" : ""
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </>
  );
};

export default AllCourses;
