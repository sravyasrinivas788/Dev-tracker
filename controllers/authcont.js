const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const User=require('../models/Usermodel')
const bcrypt=require('bcryptjs')
const {gettoken}=require('../utils/generatetoken')
const client=require('../config/redisclient')
const { cloudinary } = require('../config/cloduinary')

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
const uploadimage=async(req,res)=>{
    try{
        const userId=req.user.id
       
        const profileid=req.file.filename
        const updated= await User.findByIdAndUpdate(
            userId,
            {
               
                profileid:profileid
            },
            {new:true}

        );
        res.status(200).json({message:"profile updated succesfully",profileid:updated.profileid})

    }
    catch(err){
        res.json(err)
    }
}

const getusers = async (req, res) => {
    try {
        const users = await User.find({}, "_id email profileid");
        const signedUsers = [];

        for (const user of users) {
            const cacheKey = `profile:${user.profileid}`;
            let signedUrl = await client.get(cacheKey);

            if (!signedUrl) {
                signedUrl = cloudinary.url(user.profileid, {
                    type: "authenticated",
                    secure: true,
                    sign_url: true,
                    transformation: [{ width: 500, height: 500, crop: "limit" }],
                    expires_at: Math.floor(Date.now() / 1000) + 60 * 5, 
                });

                
                await client.setex(cacheKey, 300, signedUrl);
            }

            signedUsers.push({
                _id: user._id,
                email: user.email,
                profile: signedUrl,
            });
        }

        res.status(200).json(signedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const logout=async(req,res)=>{
   
const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  await client.del(`jwt:${token}`)
  return res.status(200).json({message:"logged out "})


    
}



module.exports={handlereg,handlelogin,getusers,logout,uploadimage}