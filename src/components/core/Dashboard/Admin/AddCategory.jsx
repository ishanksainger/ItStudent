import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../common/IconBtn";
import { createCategory } from "../../../../services/operations/courseDetailsAPI";
import { useSelector } from "react-redux";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit=async(data)=>{
    const formData = new FormData();
    formData.append("name", data.categoryName);
    formData.append("description", data.categoryDesc);
    setLoading(true);
    await createCategory(formData,token);
    setLoading(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 "
    >
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="categoryName">
          Category Name <sup className="text-pink-200">*</sup>
        </label>
        <input
          className="form-style w-full"
          id="categoryName"
          placeholder="Enter Category Name"
          {...register("categoryName", { required: true })}
        />
        {errors.categoryName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Category Name is Required
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="categoryDesc">
          Category Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          className="form-style resize-x-none min-h-[130px] w-full"
          id="categoryDesc"
          placeholder="Enter Description"
          {...register("categoryDesc", { required: true })}
        />
        {errors.categoryDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Category Description is Required
          </span>
        )}
      </div>
      <div className="flex justify-end gap-x-2">
        <IconBtn disabled={loading} text="Save Category"/>
      </div>
    </form>
  );
};

export default AddCategory;
