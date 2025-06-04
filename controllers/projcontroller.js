const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const User=require('../models/Usermodel')
const Project=require('../models/Projectmodel')
const client=require('../config/redisclient')
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
    
    const userid=req.user.id
    
    
    try{
        const cachedprojects=await client.get(`user:${userid}:projects`)
        if(cachedprojects){
            return res.json(JSON.parse(cachedprojects));
        }
        
        const projects=await Project.find({$or:[{createdBy:userid},{"members._id":userid}],

        }).populate('createdBy','email')
        await client.setex(`user:${userid}:projects`,120,JSON.stringify(projects))
        
        res.status(200).json(projects)

    }
    catch(err){
        res.json({message:"project not found"})
    }

}

const updateprojects=async(req,res)=>{
    try{
        const project=await Project.findById(req.params.id)
        if(!project){
           return  res.status(404).json({message:"project not found"})
        }
        if(project.createdBy.toString()!=req.user.id){
            return res.status(403).json({message:"not authenticated"})

        }
        const updated =await Project.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { members: { $each: req.body.members } } },
            { new: true }
          );
          
          
        
        await client.del(`user:${req.user.id}:projects`);

        res.json(updated)

    }
    catch(err){
        return res.status(404).json({message:"project not found"})

    }

}

const deleteproject=async(req,res)=>{
    try{
        const project=await Project.findById(req.params.id)
        if(!project){
           return  res.status(404).json({message:"project not found"})
        }
        if(project.createdBy.toString()!=req.user.id){
            return res.status(403).json({message:"not authenticated"})

        }
        await project.deleteOne()
        await client.del(`user:${req.user.userid}:projects`);

        res.json({message:"project deleted"})
        res.json(updated)

    }
    catch(err){
        return res.status(404).json({message:"project not found"})

    }

}

module.exports={addproject,getprojects,updateprojects,deleteproject}