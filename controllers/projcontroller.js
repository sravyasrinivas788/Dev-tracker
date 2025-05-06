const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const User=require('../models/Usermodel')
const Project=require('../models/Projectmodel')
const bcrypt=require('bcryptjs')


const addproject=async(req,res)=>{
    const{title,description,members}=req.body;
    
}