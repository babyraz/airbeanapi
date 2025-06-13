import { Router } from 'express';
import { validateAuthBody } from '../middlewares/validators.js';
import { getUser, registerUser } from '../services/users.js';
import { v4 as uuid } from 'uuid';
import { signToken, hashPassword, comparePassword } from '../utils/index.js';


const router = Router();

router.get('/logout', (req, res) =>{
    res.json('Logged out!');
})  

router.post('/register', validateAuthBody, async (req, res) => {
    const { username, password, role } = req.body;
    const pass = await hashPassword(password);

    const result = await registerUser({
        username: username,
        password : pass,
        role : role,
        userId : `${role}-${uuid().substring(0, 5)}`
    });
    if(result) {
        res.status(201).json({
            success : true,
            message : 'New user registered successfully'
        });
    } else {
        res.status(400).json({
            success: false,
            message : 'Registration unsuccessful'
        });
    }
});

router.post('/login', validateAuthBody, async (req, res, next) => {
        const { username, password } = req.body;
        const user = await getUser(username);
            if(user){
                const correctPassword = await comparePassword(password, user.password);
    
                if(correctPassword){
                    const token = signToken({ userId : user.id});
                     res.json({
                        success : true,
                        message : "Logged in successfully!",
                        token : `Bearer ${token}`
                     });
                } else {
                    next({
                        success : false,
                        status : 400,
                        message : "Wrong username or password"
                    })
                }
    
            } else{
                next({
                    success : false,
                    status : 400,
                    message : "No user found"
                })
            }
        }) 

export default router;