const jwt=require('jsonwebtoken')
const auth=(req,res,next)=>{
    const token=req.header("Authorization")?.split(" ")[1]
    if(!token){
        return res.status(401).json({"message":"Not Authorized"})
    }
    try{
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