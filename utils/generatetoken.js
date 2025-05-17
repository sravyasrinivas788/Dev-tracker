const jwt=require('jsonwebtoken')
const client=require('../config/redisclient')

const gettoken=async(userId,role)=>{
    const token=await jwt.sign({userId,role},process.env.JWT_SECRET,{
        expiresIn:"1h"
    })
    await client.setex(`jwt:${token}`,3600,"valid")
    return token

}

module.exports={gettoken}