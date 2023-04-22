// import { Router } from 'express';
import Router from './router.js';
import passport from 'passport';
import { compareHashedData, generateToken, hashData } from '../../utils.js';
import jwt from 'jsonwebtoken';
import UsersManager from '../../dao/dbManagers/users.js';

const usersManager = new UsersManager();
export default class SessionRouter extends Router{
    init(){
        this.post('/register', ['PUBLIC'], this.register);
        this.post('/login', ['PUBLIC'], this.login);
    }

    async register(req, res){
        try{
            const { first_name, last_name, email, age, password, rol } = req.body;
    
            if(!first_name || !last_name || !email || !age || !password || !rol ){
                return res.sendClientError('incomplete values');
            }
    
            const userDB = await usersManager.getByEmail(email);
    
            if(userDB){ 
                return res.sendClientError('User already exists'); 
            } else{ 
                const hashPassword = await hashData(password); //hasehamos la contraseña 
    
                const user = {
                    ...req.body
                } 
    
                user.password = hashPassword;
    
                const newUserDB = await usersManager.saveUser(user); 
    
                res.sendSuccess(newUserDB); 
            };
        } catch(error){
            console.log(error);
            res.sendServerError(error);
        }
    }
    
    async login(req, res){
        try{
            const { email, password } = req.body;
    
            const user= await usersManager.getByEmail(email);
            if(!user) return res.sendClientError('Incorrect credentials'); 
            
            const comparePassword = await compareHashedData(password, user.password);
            if(!comparePassword) return res.sendClientError('Incorrect credentials'); 
            
            const usuario={
                user : user.email, 
                rol: user.rol
            }
            const accessToken = generateToken(usuario);
            res.sendSuccess({accessToken}); 
    
        } catch(error){
            console.log(error);
            res.sendServerError(error);
        }
    }

}


// const router = Router();

// router.post('/register', passport.authenticate('register', { failureRedirect: 'fail-register' }), async (req, res) => {
//     res.send({ status: 'success', message: 'User registered' })
// });

// router.get('/fail-register', async (req, res) => {
//     res.send({ status: 'error', message: 'Register failed' });
// });

// router.post('/login', passport.authenticate('login', { failureRedirect: 'fail-login' }), async (req, res) => {
//     if (!req.user) return res.status(400)
//         .send({ status: 'error', message: 'Invalid credentials' });

//     // let rol;
//     // if(req.user.email.slice(0,5) === 'admin' && req.user.password === 'adminCod3r123') rol = 'admin';
//     // else rol = 'usuario';

//     // delete req.user.password; 

//     req.session.user = {
//         name: `${req.user.first_name} ${req.user.last_name}`,
//         age: req.user.age,
//         email: req.user.email,
//         // rol: rol
//     }

//     res.send({ status: 'success', message: 'login success' });
// });

// router.get('/fail-login', async (req, res) => {
//     res.send({ status: 'error', message: 'login failed' });
// });

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
//     res.send({ status: 'succes', message:'user Registered'});
// });

// router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
//     req.session.user = {
//         name: `${req.user.first_name} ${req.user.last_name}`,
//         age: req.user.age,
//         email: req.user.email,
//         // rol: rol
//     }

//     res.redirect('/products');   
// })

// router.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) return res.status(500).send({ status: 'error', error: 'couldnt logout' });
//         res.redirect('/products');
//     })
// });
//export default router;


//-----------------------------JWT---------------------------------------
// router.get('/session/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({ token: req.headers.authorization.split(" ")[1] });
//   });
