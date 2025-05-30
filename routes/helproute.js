const express=require('express')
const router=express.Router()
const {getallarticles,getarticlebyslug}=require('../controllers/helpcontroller')
router.get('/',getallarticles)
router.get('/:slug',getarticlebyslug)
module.exports=router