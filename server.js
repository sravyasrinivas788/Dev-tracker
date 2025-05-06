const express=require('express')
require('dotenv').config()
const connectDB=require('./config/db')
const authroute=require('./routes/authroute')
connectDB()
const app=express()
app.use(express.json())
app.get('/ping',(req,res)=>{
    res.json({"message":"pong"})
})
app.use('/auth',authroute)
app.listen(4000,()=>{
    console.log("app listening at port 4000")
})