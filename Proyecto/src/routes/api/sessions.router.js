// import { Router } from 'express';
import { login, register } from '../../controllers/api/sessions.controller.js';
import Router from './router.js';
// import passport from 'passport';
// import { compareHashedData, generateToken, hashData } from '../../utils.js';
// import UsersManager from '../../dao/dbManagers/users.js';

// const usersManager = new UsersManager();
export default class SessionRouter extends Router{
    init(){
        this.post('/register', ['PUBLIC'], register);
        this.post('/login', ['PUBLIC'], login);
    }
}

//-----------------------------JWT---------------------------------------
// router.get('/session/current', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.json({ token: req.headers.authorization.split(" ")[1] });
//   });
