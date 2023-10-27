import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { fetchCourseCategories } from "../../../../services/operations/courseDetailsAPI";
import IconBtn from "../../../common/IconBtn";
import { VscAdd } from "react-icons/vsc";

const AllCategories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryPerPage = 10;

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      const result = await fetchCourseCategories();
      if (result) {
        setCategory(result);
      }
      setLoading(false);
    };
    fetchAllCategories();
  }, []);


  const paginate = (category, currentPage, categoryPerPage) => {
    const startIndex = (currentPage - 1) * categoryPerPage;
    const endIndex = startIndex + categoryPerPage;
    return category.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigateToAddCategory = () => {
    navigate('/dashboard/addcategory');
  };

  const paginatedCategories = paginate(category, currentPage, categoryPerPage);

  return (
    <>
    <div className="flex justify-end mb-4">
    <IconBtn onClick={navigateToAddCategory}
                text="Add Category"><VscAdd /></IconBtn>
    </div>
      <Table className="rounded-xl border border-richblack-600 responsiveTableDisable ">
        <Thead>
          <Tr className="flex justify-between gap-x-10 rounded-t-md border-b border-b-richblack-600 px-6 py-2">
            <Th className="flex-1 lg:flex-2 md:flex-1 sm:flex-1 text-left text-lg font-medium uppercase text-richblack-100">
              S.No
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-center text-lg font-medium uppercase text-richblack-100">
              Total Courses
            </Th>
            <Th className="lg:flex-1 md:flex-1 sm:flex-1 text-right text-lg font-medium uppercase text-richblack-100">
              No. of Courses
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {category?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            paginatedCategories.map((categories,index) => (
              <Tr
                key={categories._id}
                className="flex flex-col sm:flex-col sm:items-center sm: gap-4 md:flex-col md:justify-between lg:flex-row gap-x-10 border border-richblack-600 px-6 py-8 responsiveTableCustom"
              >
                <Td className="flex md:flex-col sm:flex-col lg:flex-row items-center gap-y-2 sm:gap-x-4 md:gap-x-4 lg:gap-x-4">
                <p className="text-lg  text-richblack-5">
                      {index+1}
                    </p>
                    </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  <div className="flex flex-col sm:gap-y-1 md:gap-y-1 lg:gap-y-1">
                    <p className="text-lg text-richblack-5">
                      {categories?.name}
                    </p>
                  </div>
                </Td>
                <Td className="text-lg font-medium text-richblack-100">
                  {categories?.course.length}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <div className="pagination  my-[20px] mx-auto w-fit text-white ">
        {Array.from({
          length: Math.ceil(category.length / categoryPerPage),
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

export default AllCategories;
