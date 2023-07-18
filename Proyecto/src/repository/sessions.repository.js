import UsersManager from '../dao/dbManagers/users.js';

const usersManager = new UsersManager();

export default class SessionsRepository {
    constructor(){
        // this.dao = dao;
    };

    register = async (user) => {
        const newUserDB = await usersManager.saveUser(user); 
        return newUserDB;
    }
    
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

    resetPassword = async(user, newPassword) => {
        const userUpdate = await usersManager.updatePasswordUser(user, newPassword);
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

    getUsers = async () => {
        const users = await usersManager.getUsers();
        return users; 
    }

    deleteUsers = async (id) => {
        const usersDelete = await usersManager.deleteUsers(id);
        return usersDelete; 
    }

    updateCart = async (email, cart) => {
        const result = await usersManager.updateCart(email, cart);
        return result; 
    }
}

