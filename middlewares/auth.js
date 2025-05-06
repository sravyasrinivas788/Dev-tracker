const jwt=require('jsonwebtoken')
const auth=(req,res,next)=>{
    const token=req.header("Authorization")?.split(" ")[1]
    if(!token){
        return res.status(401).json({"message":"token not found"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next();
    }
    catch(err){
        res.status(401).json(err.message)
    }




}

const role=(reqrole)=>{
    return ()

}