const Section = require("../models/Section")
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
    try {
        //data fetch - //sent courseid via frontend
        const { sectionName, courseId } = req.body;
        //data validation
        if (!sectionName || !courseId) {
            res.status(400).json({
                success: false,
                message: "Missing course",
            })
        }
        //create section
        const newSection = await Section.create({ sectionName })

        //update course with object id
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id
            }
        }, { new: true }).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        }).exec()

        res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            updatedCourse
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to Create Section. Please try again",
            message: error.message
        })
    }
}

//update section

exports.updateSection = async (req, res) => {
    try {
        //data fetch - //sent sectionId via frontend
        const { sectionName, sectionId,courseId } = req.body;
        //data validation
        if (!sectionName || !sectionId) {
            res.status(400).json({
                success: false,
                message: "Missing section",
            })
        }

        //update course with object id
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })
        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();
        res.status(200).json({
            success: true,
            message: section,
            data: course,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update Section. Please try again",
            message: error.message
        })
    }
}

//delete section

exports.deleteSection = async (req, res) => {
    try {
        //data fetch - //sent sectionId via frontend
        // const sectionId=req.params.id
        const { sectionId, courseId } = req.body;
        //data validation
        if (!sectionId) {
            res.status(400).json({
                success: false,
                message: "Missing course",
            })
        }

        // Find and update the course to remove the reference to sectionId
        await Course.findByIdAndUpdate( courseId , // Replace courseId with the actual ID of the course you want to update
            { $pull: { courseContent: sectionId } }, // Remove the reference to sectionId from the 'sections' array field
        );
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not Found",
            })
        }

        //delete sub section
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        await Section.findByIdAndDelete(sectionId);
        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
            .exec();

        res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
            data:course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}