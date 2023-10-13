const Category = require("../models/Category")

//create Category ka handler function
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            res.status(400).json({
                success: false,
                message: "All Fields are required"
            })
        }
        //create db entry
        const categoryDetails = await Category.create({
            name: name,
            description: description
        })
        res.status(200).json({
            success: true,
            message: "Category created Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
//getAll Category handler function
exports.showAllCategories=async(req,res)=>{
    try {
        const allCategories=await Category.find()
        // console.log(allCategories);
        res.status(200).json({
            success:true,
            message:"All Categories returned Successfully",
            data:allCategories 
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//category page details

exports.categoryPageDetails = async (req, res) => {
    try {
        //get category id
        const { categoryId } = req.body

        //get courses for specified category id

        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec()
            // console.log("SELECTED COURSE", selectedCategory)

        //validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        // Handle the case when there are no courses
        if (selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "course",
                match: { status: "Published" },
            })
            .exec()

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "course",
                match: { status: "Published" },
            })
            .exec()
        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}