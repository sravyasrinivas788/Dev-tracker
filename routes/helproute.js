const express=require('express')
const router=express.Router()
const {getallarticles,getarticlebyslug,getdashboard,getaboutpage}=require('../controllers/helpcontroller')
router.get('/',getallarticles)
router.get('/:slug',getarticlebyslug)
router.get('/other/dash',getdashboard)
router.get('/other/about',getaboutpage)
module.exports=router