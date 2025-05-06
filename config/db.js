const mongoose=require('mongoose')
const connectDB=async()=>{
    try{
    mongoose.connect(process.env.MONGO_URI)
    console.log('database connected')
    }
    catch(err){
        console.log(err.message)

    }

}
module.exports=connectDB