const jwt=require('jsonwebtoken')
const client=require('../config/redisclient')
const auth=async(req,res,next)=>{
    const authheader=req.headers.authorization
    if (!authheader || !authheader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
    const token=authheader.split(" ")[1]

    
    try{
        const isvalid=await client.get(`jwt:${token}`)
        if(!isvalid){
            return res.status(401).json({message:"invalidated"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user={
            id:decoded.userId,
            role:decoded.role

        }
        next();
    }
    catch(err){
        res.status(401).json(err.message)
    }




}

const role=(reqrole)=>{
    return (req,res,next)=>{
        if(req.user.role!=reqrole){
            return res.status(403).json({"message":"access denied for this role"})

        }
        next();

    }

}

module.exports={auth,role}