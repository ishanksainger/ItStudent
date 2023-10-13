const mongoogse=require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoogse.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("DB connection Successfull");
    })
    .catch((error)=>{
        console.log("DB connection failed");
        console.error(error);
        process.exit(1)
    })
}