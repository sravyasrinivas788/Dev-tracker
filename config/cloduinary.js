const cloudinary=require('cloudinary').v2
const { CloudinaryStorage}=require("multer-storage-cloudinary")
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME ,
    api_key:process.env.API_KEY ,
    api_secret:process.env.API_SECRET 

})
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"devtrack_user",
        allowed_formats:["jpg","png"],
        type:"authenticated",
        transformation:[{ width: 500, height: 500, crop: "limit" }]

    }
})

module.exports={cloudinary,storage}
