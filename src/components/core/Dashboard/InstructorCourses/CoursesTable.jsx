import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'
import { COURSE_STATUS } from '../../../../utils/constants'
import ConfirmationModal from "../../../common/ConfirmationModal"
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../slices/courseSlice'
import { useNavigate } from 'react-router-dom'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { formatDate } from "../../../../services/formatDate"
import 'tailwindcss/tailwind.css';

const CoursesTable = ({ courses, setCourses }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const [confirmaationModal, setConfirmationModal] = useState(null)
    const TRUNCATE_LENGTH = 30

    const handleCourseDelete = async (courseId) => {
        setLoading(true)
        await deleteCourse({ courseId: courseId }, token)
        const result = await fetchInstructorCourses(token)
        if (result) {
            setCourses(result)
        }
        setConfirmationModal(null)
        setLoading(false)
    }

    const calculateTotalDuration = (courses) => {
        let totalMinutes = 0;

        // Iterate through sections
        for (const section of courses.courseContent) {
            // Calculate the duration of the section in minutes
            const sectionMinutes = section.subSection.reduce(
                (acc, subsection) => {
                    const [minutes, seconds] = subsection.timeDuration.toString().split('.');
                    const fractionalMinutes = seconds ? parseFloat(`0.${seconds}`) : 0;
                    return acc + parseFloat(minutes) + fractionalMinutes;
                },
                0
            );

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
                        <Th className="flex-1 lg:flex-2 md:flex-1 sm:flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                            Courses
                        </Th>
                        <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                            Duration
                        </Th>
                        <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                            Price
                        </Th>
                        <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                            Actions
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        courses?.length === 0 ? (
                            <Tr>
                                <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                                    No Courses Found
                                </Td>
                            </Tr>
                        )
                            :
                            (
                                courses?.map((course) => (
                                    <Tr key={course._id} className="flex flex-col sm:flex-row md:flex-row md:justify-evenly lg:flex-row gap-x-10 border border-richblack-600 px-6 py-8 responsiveTableCustom">
                                        <Td className="flex md:flex-col sm:flex-col lg:flex-row  items-center sm:items-start md:items-start lg:items-start gap-y-2 sm:gap-x-4 md:gap-x-4 lg:gap-x-4">
                                            <img
                                                src={course?.thumbnail}
                                                className="h-[148px] w-[220px] sm:w-[148px] md:w-[148px] lg:w-[220px] rounded-lg object-cover"
                                            />
                                            <div className="flex flex-col sm:gap-y-1 md:gap-y-1 lg:gap-y-1">
                                                <p className="text-lg font-semibold text-richblack-5">{course?.courseName}</p>
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
                                                </p> {course?.status === COURSE_STATUS.DRAFT ? (
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
                                        <Td className="text-sm font-medium text-richblack-100"> {calculateTotalDuration(course)}</Td>
                                        <Td className="text-sm font-medium text-richblack-100">{course?.price}</Td>
                                        <Td className="text-sm font-medium text-richblack-100 ">
                                            <button disabled={loading} onClick={() => navigate(`/dashboard/edit-course/${course._id}`)} title="Edit"
                                                className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"><FiEdit2 size={20} /></button>
                                            <button disabled={loading} onClick={() => setConfirmationModal({
                                                text1: "Do you Want to Delete this Course",
                                                tex2: "All the data related to this course will be deleted",
                                                btn1Text: "Delete",
                                                btn2Text: "Cancel",
                                                btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => { },
                                                btn2Handler: !loading ? () => setConfirmationModal(null) : () => { },
                                            })} title="Delete"
                                                className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                                            >
                                                <RiDeleteBin6Line size={20} /></button>
                                        </Td>
                                    </Tr>
                                ))
                            )
                    }
                </Tbody>
            </Table>
            {confirmaationModal && <ConfirmationModal modalData={confirmaationModal} />}
        </>
    )
}

export default CoursesTable