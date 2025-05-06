const express=require('express')
const router=express.Router()
const {handlereg,handlelogin}=require('../controllers/authcont')
const {auth,role}=require('../middlewares/auth')
router.get('/user',auth,(req,res)=>{
    res.status(200).json({"message":"user authenticated"},req.user)
})
router.get('/admin',auth,role('admin'),(req,res)=>{
    res.status(200).json({"message":"welcome admin"})

})
module.exports=router