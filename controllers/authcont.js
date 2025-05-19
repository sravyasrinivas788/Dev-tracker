const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const User=require('../models/Usermodel')
const bcrypt=require('bcryptjs')
const {gettoken}=require('../utils/generatetoken')
const client=require('../config/redisclient')

const handlereg=async(req,res)=>{
    const {name,email,password,role}=req.body
    try{
        const user=await User.findOne({email})
        if (user){
            return res.status(400).json({"message":"user already exists"})

        }
        const hashedpassword=await bcrypt.hash(password,10)
        const newuser=new User({name,email,password:hashedpassword,role:role})
        await newuser.save()
        res.status(201).json({ msg: 'User created successfully' });
    }
    catch(err){
        return res.json(err.message)
    }
}
const handlelogin=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})
        if (!user){
            return res.status(400).json({"message":"user not found "})

        }
        const passwordmatch= await bcrypt.compare(password,user.password)
        if(!passwordmatch){
            return res.status(400).json({"message":"wrong passowrd"})
        }
        const token=await gettoken(user._id,user.role)
        res.status(200).json({"message":"successfull login",token})
        
    }
    catch(err){
        return res.json(err.message)
    }
}
const getusers=async(req,res)=>{
    try{
        const users=await User.find({},"_id emial")
        res.status(200).json(users)

    }
    catch(err){
        res.json(err.message)
    }
}

const logout=async(req,res)=>{
   
const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  await client.del(`jwt:${token}`)
  return res.status(200).json({message:"logged out "})


    
}
const uploadimage=async(req,res)=>{
    try{
        const userId=req.user.id
        const profile=req.file.path
        const updated= await User.findByIdAndUpdate(
            userId,
            {profile:profile},
            {new:true}

        );
        res.status(200).json({message:"profile updated succesfully",profile:updated.profile})

    }
    catch(err){
        res.json(err)
    }
}



module.exports={handlereg,handlelogin,getusers,logout,uploadimage}