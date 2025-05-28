const request=require('supertest')
const app=require('../app')
const mockingoose=require('mockingoose')
const User=require('../models/Usermodel')
const bcrypt=require('bcrypt')

describe('POST /login',()=>{
    beforeEach(() => {
        mockingoose.resetAll();
      });
      it("should login with existing creds",async()=>{
        const user= {
        _id: "123",
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user"
        }
        mockingoose(User).toReturn(user,"findOne")
        const res=await request(app).post('/auth/login').send({
            email: "test@example.com",
            password: "password123"
        })
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('successfull login')
        expect(res.body).toHaveProperty("token")

      })
      it("should use correct password",async()=>{
        const user={
            email: "test@example.com",
            password: await bcrypt.hash("password123", 10)
        }
        mockingoose(User).toReturn(user,"findOne")
        const res =await request(app).post('/auth/login').send({
            email: "test@example.com",
            password: "wrong"


        })
        expect(res.statusCode).toBe(401)
        expect(res.body.message).toBe('wrong password')
      })
      it("should enter valid email",async()=>{
        mockingoose(User).toReturn(null,"findOne")
        const res= await request(app).post('/auth/login').send({
            email: "notcorrect@example.com",
            password: "wrong"


        })
        expect(res.statusCode).toBe(404)

      })



      
})