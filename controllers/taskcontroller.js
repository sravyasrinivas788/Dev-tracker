const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const User=require('../models/Usermodel')
const Project=require('../models/Projectmodel')
const Task=require('../models/Taskmodel')
const client=require('../config/redisclient')


const addtask=async(req,res)=>{
    const{title,description,assignedTo,projectId}=req.body
    const userid=req.user.id
    try{
        const project=await Project.findById(projectId);
        if(!project){
            return res.status(404).json("project not found")
        }
        const isvalid =
  project.createdBy.toString() === userid ||
  project.members.some(member => member._id.toString() === userid);

        if(!isvalid){
            return res.status(403).json("not authorized")
        }
        const newtask= new Task({
            title,
            description,
            assignedTo:userid,
            projectId
        })
        await newtask.save()
        res.status(200).json("tasks are created")


        
    
    }
    catch(err){
        return res.json(err.message)
    }
}

const gettasks=async(req,res)=>{
    const userid=req.user.id
    const projectId=req.params.id

    try{
        const chachedtasks=await client.get(`tasks:${projectId}`)
        if(chachedtasks){
            return res.json(JSON.parse(chachedtasks))
        }
        

        const project=await Project.findById(req.params.id)
        if(!project){
            return res.status(404).json("project not found")
        }
        const isvalid =
  project.createdBy.toString() === userid ||
  project.members.some(member => member._id.toString() === userid);

        if(!isvalid){
            return res.status(403).json("not authorized")
        }
        const tasks=await Task.find({projectId:req.params.id}).select("title assignedTo status").populate(
            "assignedTo",
            "email"

        
        )
        await client.setex(`tasks:${projectId}`,120,JSON.stringify(tasks))
        res.json(tasks)



    }
    catch(err){
        return res.json(err.message)
    }
}

const updatetasks=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id)
        const project = await Project.findById(task.projectId);

        if(!task){
            return res.status(404).json("task not found")

        }
        const isAllowed =
      task.assignedTo?.some(user => user.toString() === req.user.id) ||
      project.createdBy.toString() === req.user.id;
        if(!isAllowed){
            return res.status(403).json("not authorized")
        }
        const updated=await Task.findByIdAndUpdate(req.params.id,
          
            req.body,{new:true}
        )
        await client.del(`task:${req.params.id}`);

        res.json(updated)
    }
    catch(err){
        return res.json(err.message)
    }
}

const deletetask=async(req,res)=> {
    try {
      const task = await Task.findById(req.params.id).populate("projectId");
      if (!task) return res.status(404).json({ msg: "Task not found" });
  
      if (task.projectId.createdBy.toString() !== req.user.id)
        return res.status(403).json({ msg: "Only creator can delete tasks" });
  
      await task.deleteOne();
      await client.del(`task:${req.params.id}`)
      res.json({ msg: "Task deleted" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }

module.exports={addtask,gettasks,updatetasks,deletetask}
