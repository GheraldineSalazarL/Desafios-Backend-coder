// import { Router } from 'express';
import Router from './router.js';
// import passport from 'passport';
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

//-----------------------------JWT---------------------------------------
// router.get('/session/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({ token: req.headers.authorization.split(" ")[1] });
//   });
