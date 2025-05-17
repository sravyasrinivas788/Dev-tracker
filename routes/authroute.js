const express=require('express')
const router=express.Router()
const {handlereg,handlelogin,getusers,logout}=require('../controllers/authcont')
const {auth,role}=require('../middlewares/auth')

router.post('/reg',handlereg)
router.post('/login',handlelogin)
router.get('/users',getusers)
router.post('/logout',logout)
module.exports=router
