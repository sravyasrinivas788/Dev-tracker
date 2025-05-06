const express=require('express')
const router=express.Router()
const {handlereg,handlelogin}=require('../controllers/authcont')

router.post('/reg',handlereg)
router.post('/login',handlelogin)

module.exports=router