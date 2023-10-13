const Tag=require("../models/Tags")

//create Tag ka handler function

exports.createTag=async(req,res)=>{
    try {
        //fetch data
        const {name,description}=req.body;
        //validation
        if(!name || !description){
            res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }
        //create db entry
        const tagDetails=await Tag.create({
            name:name,
            description:description
        })
        res.status(200).json({
            success:true,
            message:"Tag created Successfully"
        }) 
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//getAll tags handler function

exports.showAllTags=async(req,res)=>{
    try {
        const allTags=await Tag.find({}, {
            name:true,
            description:true
        })
        res.status(200).json({
            success:true,
            message:"All Tags returned Successfully",
            allTags 
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}