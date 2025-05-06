const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const User=require('../models/Usermodel')
const Project=require('../models/Projectmodel')
const bcrypt=require('bcryptjs')


const addproject=async(req,res)=>{
    const{title,description,members}=req.body;
    const users=await User.find({email:{$in:members}})
    const memobj=users.map(user=>({
        _id:user.id,
        email:user.email
    }))
    
    try{
        const newproject=new Project({
            title,
            description,
            createdBy: req.user.id,
            members:memobj
            


        })
        await newproject.save()
        res.status(200).json({"message":"Project Created"})
    }
    catch(err){
        res.json(err.message)
    }

    
}

const getprojects=async(req,res)=>{
    console.log("Reached /pro/gp with user ID:", req.user?.id);
    
    try{
        console.log("Reached /pro/gp with user ID:", req.user?.id);
        const userid=req.user.id
        const projects=await Project.find({$or:[{createdBy:userid},{"members._id":userid}],

        }).populate('createdBy','email')
        
        res.status(200).json(projects)

    }
    catch(err){
        res.json(err.message)
    }

}

module.exports={addproject,getprojects}