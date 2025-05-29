const jwt=require('jsonwebtoken')
const {auth}=require('../middlewares/auth')
const client=require('../config/redisclient')

describe('authentication-middlewares',()=>{
    const mockreq={}
    const mockres={
        status: jest.fn().mockReturnThis(),
    json: jest.fn()
    }
    const mocknext=jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
      });
    it("should return unauthorized for no token",()=>{
        mockreq.headers={}
        auth(mockreq,mockres,mocknext)
        expect(mockres.status).toHaveBeenCalledWith(401)
        expect(mockres.json).toHaveBeenCalledWith({message:'No token provided'})

    })
it(' should give a error for invalid token',async()=>{
    mockreq.headers = { authorization: 'Bearer inValid' };
    jwt.verify=jest.fn(()=>{throw new Error()});
    await auth(mockreq,mockres,mocknext)
    expect(mockres.status).toHaveBeenCalledWith(403)
    expect(mockres.json).toHaveBeenCalledWith({message:"invalid token"})
})

it('should proceed to the next function after calling',async()=>{
    const testuser={id:'123',role:'admin'}
    mockreq.headers={authorization:'Bearer validtoken'}
    client.get = jest.fn().mockResolvedValue('true');
    jwt.verify = jest.fn().mockReturnValue({
        userId: testuser.id,
        role: testuser.role
      });
    await auth(mockreq,mockres,mocknext)
    expect(mockreq.user).toEqual(testuser)
    expect(mocknext).toHaveBeenCalled()

})

})

