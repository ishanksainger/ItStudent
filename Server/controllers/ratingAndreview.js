const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create Rating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;

        //fetch data  from req body
        const { rating, review, courseId } = req.body

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({ _id: courseId, studentsEnrolled: 
            { $elemMatch: { $eq: userId } } })
        //check if the user is already reviewed the course
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Students are not enrolled in the course.'
            })
        }

        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user'
            })
        }

        //create the review
        const ratingAndReview = await RatingAndReview.create({
            rating, review, course: courseId, user: userId
        })

        //update course with this rating and review
        await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReviews: ratingAndReview._id
            }
        })
        await courseDetails.save()
        //return 
        return res.status(200).json({
            success: true,
            message: 'Rating and Review has been submitted sucessfully',
            ratingAndReview
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

//Average Rating

exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const { courseId } = req.body;
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {// we use match to match the course id in the rating and review schema
                $match: {
                    //course id was string so we converted it to the object id to match it
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            //once matched we group all that same course reviews 
            {
                $group: {
                    // we do id null because we dont want to group them on any specific field so we did id null
                    _id: null,
                    // now we do average of all that grouped ratings which is rating and review schema 
                    averageRating: { $avg: "$rating" }
                }
            }
        ])
        //return rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                //result has reviews in terms of array so we get the first value and from first value document we want specifically averagerating
                averageRating: result[0].averageRating
            })
        }
        //if no reviews exist
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no rating given till now",
            averageRating: 0
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating for the course",
            error: error.message,
        })
    }
}

//getAll Rating

exports.getAllRatingAndReview=async(req,res)=>{
    try {
        const allReview=await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            //after we populate the user we want only these below fields from user schema
            select:"firstName lastName email image"
        }).populate({
            path:"course",
            //after we populate the user we want only these below fields from user schema
            select:"courseName"
        }).exec()

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReview
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
        })
    }
}