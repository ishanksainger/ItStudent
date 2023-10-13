const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")

exports.updateCourseProgress=async(req,res)=>{
    const{courseId,subSectionId}=req.body

    const userId=req.user.id

    try {
        const subSection=await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({
                error:"Invalid SubSection"
            })
        }
        let courseProgress=await CourseProgress.findOne({ 
            courseID:courseId,
            userId:userId
        })

        if(!courseProgress){
            return res.status(404).json({
                success:false,
                error:"Course Progress doesn't exist SubSection"
            })
        }
        else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error:"SubSection already completed"
                })
            }
            courseProgress.completedVideos.push(subSectionId)
        }
        await courseProgress.save()
        return res.status(200).json({ message: "Course progress updated" })

    } catch (error) {
        return res.status(500).json({
            success:false,
            error:"Internal Server Error"
        })
    }
}