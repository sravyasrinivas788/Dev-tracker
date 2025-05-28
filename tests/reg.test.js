const request=require('supertest')
const app=require('../app')
const mockingoose=require('mockingoose')
const User=require('../models/Usermodel')
beforeEach(() => {
    mockingoose.resetAll();
  });
describe("POST /reg",()=>{
    beforeEach(()=>{
        mockingoose.resetAll()
    })
    it("should register a new user", async () => {
        const newUser = {
          name:"sravya",
          email: "test@example.com",
          password: "password123",
          role: "user"
        };
    
        mockingoose(User).toReturn(null, "findOne"); 
        mockingoose(User).toReturn(newUser, "save");
        const res = await request(app).post('/auth/reg').send(newUser)

        expect(res.statusCode).toBe(201)
        expect(res.body.message).toBe("User created successfully")

    })
    it("should  not register if already email exists",async()=>{
        const exuser={
            name:"sravya",
            email: "test@example.com",
            password: "password123",
        }
        mockingoose(User).toReturn(exuser,"findOne")
        const res =await request(app).post('/auth/reg').send(exuser)
        expect(res.statusCode).toBe(409)
        expect(res.body.message).toBe('user already exists')

    })
    it("should identify the missing fields",async()=>{
        const res=await request(app).post('/auth/reg').send({
            email:"test@gmail.com"
        })
        expect(res.statusCode).toBe(400)
    })
})


