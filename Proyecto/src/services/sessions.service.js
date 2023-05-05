import { compareHashedData, generateToken, hashData } from '../utils.js';
import UsersManager from '../dao/dbManagers/users.js';

const usersManager = new UsersManager();

export const register = async (user) => {
    const userDB = await usersManager.getByEmail(user.email);

    if(userDB) {
        const result ='exist';
        return result;
    }; 
    
    const hashPassword = await hashData(user.password); //hasehamos la contraseña 

    const us = {
        ...user
    } 

    us.password = hashPassword;

    const newUserDB = await usersManager.saveUser(us); 

    return newUserDB;
}

export const login = async (email, password) => {
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
    
    const usuario={
        user : user.email, 
        rol: user.rol
    }
    const accessToken = generateToken(usuario);
    return accessToken; 
};