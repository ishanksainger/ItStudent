import React, { useEffect, useState } from "react";
import { getAllUsersDetails } from "../../../../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteStudent } from "../../../../services/operations/SettingsAPI";
import { useDispatch } from "react-redux";

const AllStudents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmaationModal, setConfirmationModal] = useState(null);

  const studentsPerPage = 10;

  useEffect(() => {
    const fetchAllStudents = async () => {
      setLoading(true);
      const result = await getAllUsersDetails();
      if (result) {
        const filteredStudents = result.filter(
          (student) => student.accountType === "Student"
        );
        setStudents(filteredStudents);
      }
      setLoading(false);
    };
    fetchAllStudents();
  }, []);

  const handleCourseDelete = async (users) => {
    try{
    setLoading(true);
    await deleteStudent(users._id)
    const result = await getAllUsersDetails();
    if (result) {
      const filteredStudents = result.filter(
        (student) => student.accountType === "Student"
      );
      setStudents(filteredStudents);
    }
  }
  catch (error) {
    console.log("ERROR MESSAGE - ", error.message)
  }
    setConfirmationModal(null);
    setLoading(false);
  };


  const paginate = (students, currentPage, studentsPerPage) => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return students.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedStudents = paginate(students, currentPage, studentsPerPage);

  return (
    <>
      <Table className="rounded-xl border border-richblack-600 responsiveTableDisable ">
        <Thead>
          <Tr className="flex justify-between gap-x-10 rounded-t-md border-b border-b-richblack-600 px-6 py-2">
            <Th className="flex-1 lg:flex-2 md:flex-1 sm:flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              User
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-right text-sm font-medium uppercase text-richblack-100">
              Total Courses
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-right text-sm font-medium uppercase text-richblack-100">
              Email Id
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-right text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {students?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            paginatedStudents.map((students) => (
              <Tr
                key={students._id}
                className="flex flex-col sm:flex-col sm:items-center sm: gap-4 md:flex-col md:justify-between lg:flex-row gap-x-10 border border-richblack-600 px-6 py-8 responsiveTableCustom"
              >
                <Td className="flex md:flex-col sm:flex-col lg:flex-row items-center gap-y-2 sm:gap-x-4 md:gap-x-4 lg:gap-x-4">
                  <div className="h-[148px] w-[148px] sm:w-[148px] md:w-[148px] lg:w-[148px] rounded-full overflow-hidden">
                    <img
                      src={students?.image}
                      alt={students?.firstName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col sm:gap-y-1 md:gap-y-1 lg:gap-y-1">
                    <p className="text-lg font-semibold text-richblack-5">
                      {students?.firstName}
                      {students?.lastName}
                    </p>
                  </div>
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {students?.courses.length}
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {students?.email}
                </Td>
                <Td className="text-lg font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you Want to Delete this Course",
                        tex2: "All the data related to this course will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(students)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <div className="pagination  my-[20px] mx-auto w-fit text-white ">
        {Array.from({
          length: Math.ceil(students.length / studentsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button text-3xl w-12 ${
              currentPage === index + 1 ? " border border-richblack-600" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {confirmaationModal && (
        <ConfirmationModal modalData={confirmaationModal} />
      )}
    </>
  );
};

export default AllStudents;
