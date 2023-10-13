const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImagetoCloudinary } = require("../utils/imageUploader")

//create subsection

exports.createSubSection = async (req, res) => {
    try {
        //fetch from req body
        const { sectionId, title, description } = req.body

        //extra video file
        const video = req.files.video

        //validation
        if (!sectionId || !title ||  !description || !video) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImagetoCloudinary(video,
            process.env.FOLDER_NAME)

        //create subsection
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url
        })

        //update section with subsection object id
        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId }, {
            $push: { subSection: SubSectionDetails._id }
        }, { new: true }).populate("subSection").exec()
        
       return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: updatedSection
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}


//update section

exports.updateSubSection = async (req, res) => {
    try {
        //data fetch - //sent sectionId via frontend
        const { sectionId, subSectionId, title, description } = req.body
        //data validation
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImagetoCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection")


        res.status(200).json({
            success: true,
            data: updatedSection,

            message: "SubSection updated Successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update SubSection. Please try again",
        })
    }
}

//delete section
exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }