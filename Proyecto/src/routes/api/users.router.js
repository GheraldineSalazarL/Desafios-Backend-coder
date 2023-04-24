// import { createHash, isValidPassword } from '../utils.js';
import { current } from '../../controllers/api/users.controller.js';
import Router from './router.js';
// import UsersManager from '../../dao/dbManagers/users.js';

// const usersManager = new UsersManager();

export default class UsersRouter extends Router {
    init() {
        // this.post('/register', ['PUBLIC'], this.register);
        // this.post('/login', ['PUBLIC'], this.login);
        this.get('/currentUser', ['USER', 'USER_PREMIUM'], current);
    }

    async current(req, res) {
        res.sendSuccess(req.user); 
    }

    // async register(req, res){
    //     try{
    //         const { first_name, last_name, email, age, password, rol } = req.body;

    //         if(!first_name || !last_name || !email || !age || !password || !rol ){
    //             return res.sendClientError('incomplete values');
    //         }

    //         const userDB = await usersManager.getByEmail(email);

    //         if(userDB){ 
    //             return res.sendClientError('User already exists'); 
    //         } else{ 
    //             const hashPassword = await hashData(password); //hasehamos la contraseña 

    //             const user = {
    //                 ...req.body
    //             } 

    //             user.password = hashPassword;

    //             const newUserDB = await usersManager.save(user); 

    //             res.sendSuccess(newUserDB); 
    //         };
    //     } catch(error){
    //         console.log(error);
    //         res.sendServerError(error);
    //     }
    // }

    // async login(req, res){
    //     try{
    //         const { email, password } = req.body;

    //         const user= await usersManager.getByEmail(email);
    //         if(!user) return res.sendClientError('Incorrect credentials'); 
            
    //         const comparePassword = await compareHashedData(password, user.password);
    //         if(!comparePassword) return res.sendClientError('Incorrect credentials'); 

    //         const accessToken = generateToken(user);

    //         res.sendSuccess({accessToken}); 

    //     } catch(error){
    //         console.log(error);
    //         res.sendServerError(error);
    //     }
    // }
}