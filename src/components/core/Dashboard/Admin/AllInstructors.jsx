import React, { useEffect, useState } from "react";
import { getAllUsersDetails } from "../../../../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";

const AllInstructors = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const instructorPerPage = 10;

  useEffect(() => {
    const fetchAllInstructors = async () => {
      setLoading(true);
      const result = await getAllUsersDetails();
      if (result) {
        const filteredInstructors = result.filter(
          (instructor) => instructor.accountType === "Instructor"
        );
        setInstructors(filteredInstructors);
      }
      setLoading(false);
    };
    fetchAllInstructors();
  }, []);


  const paginate = (instructors, currentPage, instructorPerPage) => {
    const startIndex = (currentPage - 1) * instructorPerPage;
    const endIndex = startIndex + instructorPerPage;
    return instructors.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedInstructors = paginate(instructors, currentPage, instructorPerPage);

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
          </Tr>
        </Thead>
        <Tbody>
          {instructors?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            paginatedInstructors.map((instructors) => (
              <Tr
                key={instructors._id}
                className="flex flex-col sm:flex-col sm:items-center sm: gap-4 md:flex-col md:justify-between lg:flex-row gap-x-10 border border-richblack-600 px-6 py-8 responsiveTableCustom"
              >
                <Td className="flex md:flex-col sm:flex-col lg:flex-row items-center gap-y-2 sm:gap-x-4 md:gap-x-4 lg:gap-x-4">
                  <div className="h-[148px] w-[148px] sm:w-[148px] md:w-[148px] lg:w-[148px] rounded-full overflow-hidden">
                    <img
                      src={instructors?.image}
                      alt={instructors?.firstName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col sm:gap-y-1 md:gap-y-1 lg:gap-y-1">
                    <p className="text-lg font-semibold text-richblack-5">
                      {instructors?.firstName}
                      {instructors?.lastName}
                    </p>
                  </div>
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {instructors?.courses.length}
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {instructors?.email}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <div className="pagination  my-[20px] mx-auto w-fit text-white ">
        {Array.from({
          length: Math.ceil(instructors.length / instructorPerPage),
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
    </>
  );
};

export default AllInstructors;
