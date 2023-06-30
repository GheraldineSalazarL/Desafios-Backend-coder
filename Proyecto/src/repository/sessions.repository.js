import { compareHashedData, generateToken, hashData } from '../utils.js';
import UsersManager from '../dao/dbManagers/users.js';
import UsersDto from '../dao/DTOs/users.dto.js';

const usersManager = new UsersManager();

export default class SessionsRepository {
    constructor(){
        // this.dao = dao;
    };

    register = async (user) => {
        const newUserDB = await usersManager.saveUser(user); 
        return newUserDB;
    }
    
    // login = async (email, password) => {        
    //     const comparePassword = await compareHashedData(password, user.password);
    //     if(!comparePassword) {
    //         const result = 'notCredentials';
    //         return result;
    //      } 
        
    //     const userDto = new UsersDto(user)
    //     const userLog = {...userDto}
    //     const accessToken = generateToken(userLog);
    //     return accessToken; 
    // };

    getByEmail = async (email) => {
        const userDB = await usersManager.getByEmail(email);
        return userDB;
    }

    forgotPassword = async(resetPassword) => {
        const newResetPasswordDB = await usersManager.saveResetPassword(resetPassword); 
        return newResetPasswordDB;
    }

    getUserResetPassword = async(userToken) => {
        const userResetPasswordDB = await usersManager.getUserResetPassword(userToken); 
        return userResetPasswordDB;
    }

    getUserDB = async(userId) => {
        const userDB = await usersManager.getById(userId); 
        return userDB;
    }

    resetPassword = async(userDB, newPassword) => {
        const userUpdate = await usersManager.updatePasswordUser(userDB, newPassword);
        return userUpdate; 
    }
    
    deleteUserResetPassword = async (userId) => {
        const deleteUserResetPassword = await usersManager.deleteUserResetPassword(userId);
        return deleteUserResetPassword; 
    }

    getById = async (uid) => {
        const userDB = await usersManager.getById(uid);
        return userDB;
    }

    updateUserRol = async (uid, rol) => {
        const updateUserRol = await usersManager.updateUserRol(uid, rol);
        return updateUserRol; 
    }

    saveDocuments = async (uid, documents) => {
        const uploaderDocuments = await usersManager.saveDocuments(uid, documents);
        return uploaderDocuments; 
    }

    updateLastConnection = async (email) => {
        const updateLastConnection = await usersManager.updateLastConnection(email);
        return updateLastConnection; 
    }
}

