const mongoose=require('mongoose')
const ProjectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true


    },
    members:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User',

        }
    ],
    status:{
        type:String,
        enum:['active','done'],
        default:'active'
    }

},{timestamps:true})

module.exports=mongoose.model('Project',ProjectSchema)