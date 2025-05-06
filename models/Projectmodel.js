const mongoose=require('mongoose')
const ProjectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        


    },
    members:[
        {
            _id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            email:String
        

        }
    ],
    status:{
        type:String,
        enum:['active','done'],
        default:'active'
    }

},{timestamps:true})

module.exports=mongoose.model('Project',ProjectSchema)