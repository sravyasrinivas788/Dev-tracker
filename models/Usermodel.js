const mongoose=require('mongoose')

const Userschema=new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
       
    },
    profile:String
})
module.exports=mongoose.model('User',Userschema)