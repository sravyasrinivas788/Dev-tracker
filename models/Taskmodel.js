const mongoose=require('mongoose')
const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description: String,
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    },
    status:{
        type:String,
        enum:['todo','in-progress','done'],
        default:'todo'


    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true

    },
    
   


},{timestamps:true})
module.exports=mongoose.model('Tasks',TaskSchema)
