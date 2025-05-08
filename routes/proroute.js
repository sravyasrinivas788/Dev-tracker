const express=require('express')
const router=express.Router()
const {addproject,getprojects,updateprojects,deleteproject}=require('../controllers/projcontroller')
const{addtask,gettasks,updatetasks,deletetask}=require('../controllers/taskcontroller')
const {auth,role}=require('../middlewares/auth')
router.post('/ap',auth,addproject)
router.get('/gp',auth,getprojects)
router.put('/up/:id',auth,updateprojects)
router.delete('/dp/:id',auth,deleteproject)
router.post('/at',auth,addtask)
router.get('/gt/:id',auth,gettasks)
router.put('/ut/:id',auth,updatetasks)
router.delete('/dt/:id',auth,deletetask)
router.get('/admin',auth,role('admin'),(req,res)=>{
    res.status(200).json({"message":"welcome admin"})

})
module.exports=router