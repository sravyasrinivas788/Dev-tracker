const multer=require('multer')
const {storage}=require('../config/cloduinary')

const upload=multer({storage})

module.exports=upload