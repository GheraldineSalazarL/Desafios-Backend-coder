import { compareHashedData, generateToken, hashData } from '../utils.js';
import UsersManager from '../dao/dbManagers/users.js';
import UsersDto from '../dao/DTOs/users.dto.js';

const usersManager = new UsersManager();

export default class SessionsRepository {
    constructor(){
        // this.dao = dao;
    };

    register = async (user) => {
        const userDB = await usersManager.getByEmail(user.email);
    
        if(userDB) {
            const result ='exist';
            return result;
        }; 
        
        const hashPassword = await hashData(user.password);
        user.password = hashPassword;
        user.rol = user.rol.toUpperCase();
    
        const newUserDB = await usersManager.saveUser(user); 
        return newUserDB;
    }
    
    login = async (email, password) => {
        const user= await usersManager.getByEmail(email);
        if(!user) {
            const result = 'notCredentials';
            return result;
         }
        
        const comparePassword = await compareHashedData(password, user.password);
        if(!comparePassword) {
            const result = 'notCredentials';
            return result;
         } 
        
        const userDto = new UsersDto(user)
        const userLog = {...userDto}
        const accessToken = generateToken(userLog);
        return accessToken; 
    };
    
}

