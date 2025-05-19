const express=require('express')
const router=express.Router()
const {handlereg,handlelogin,getusers,logout,uploadimage}=require('../controllers/authcont')
const {auth,role}=require('../middlewares/auth')
const  upload  = require('../middlewares/upload')

router.post('/reg',handlereg)
router.post('/login',handlelogin)
router.get('/users',auth,role('admin'),getusers)
router.post('/logout',logout)
router.put('/update-profile',auth,upload.single('profile'),uploadimage)
module.exports=router
