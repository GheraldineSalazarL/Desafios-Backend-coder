import UsersDto from '../dao/DTOs/users.dto.js';
import SessionsRepository from '../repository/sessions.repository.js';
import { compareHashedData, generateToken, hashData } from '../utils.js';
import { IncorrectLoginCredentials, ResultNotFound, SamePassword, TokenExpired, UserExists } from '../utils/customExceptions.js';
import { DeleteUserNotification, generatePasswordResetEmailHTML, loginNotification, registerNotification } from '../utils/customHTML.js';
import { sendEmail } from './mail.service.js';
import bcrypt from 'bcrypt';


const sessionsRepository = new SessionsRepository();

export const register = async (user) => {
    const hashPassword = await hashData(user.password);
    user.password = hashPassword;
    user.rol = user.rol.toUpperCase();

    const result = await sessionsRepository.register(user);

    const email = {
        to: user.email,
        subject:  'Registro exitoso', 
        html: registerNotification
    }
    await sendEmail(email);

    return result;
}

export const login = async (user, password) => {
    const comparePassword = await compareHashedData(password, user.password);
    if(!comparePassword) {
        throw new IncorrectLoginCredentials('Incorrect credentials');
    }
    
    const userDto = new UsersDto(user)
    const userLog = {...userDto}
    const accessToken = generateToken(userLog);

    const email = {
        to: user.email,
        subject:  'Intento de Login', 
        html: loginNotification
    }
    await sendEmail(email);
    return accessToken; 
};

export const getByEmail = async (email) => {
    const user = await sessionsRepository.getByEmail(email)
    if(!user){
        throw new ResultNotFound('User not found');
    }
    return user;
}

export const getByEmailRegister = async (email) => {
    const user = await sessionsRepository.getByEmail(email)
    return user;
}

export const forgotPassword  = async (user) => {
    const Hash = await bcrypt.hash(user.email, 1);
    const userHash = Buffer.from(Hash).toString('base64');

    const resetPassword = {
        "user" : user._id,
        "token" : userHash
    }
    
    const result = await sessionsRepository.forgotPassword(resetPassword);

    const email = {
        to: user.email,
        subject:  'Recuperación de contraseña', 
        html: generatePasswordResetEmailHTML(userHash)
    }
    await sendEmail(email);

    return result; 
}

export const getUserResetPassword = async (userToken) => {
    const userResetPasswordDB = await sessionsRepository.getUserResetPassword(userToken);
    return userResetPasswordDB;

};

export const resetPassword = async (user, userResetPasswordDB, newPassword) => {
    const tokenCreatedAt = userResetPasswordDB.createdAt.getTime();
    const tokenExpiration = 300000 ; // 1 hora en milisegundos
    const currentTime = new Date().getTime();
    
    const obj = {"email" : user.email};
    
    if (tokenCreatedAt + tokenExpiration < currentTime) {
        await sessionsRepository.deleteUserResetPassword(userResetPasswordDB.user);
        fetch('http://localhost:8080/api/sessions/forgot-password', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
              'Content-Type': 'application/json'
            } 
        })
        throw new TokenExpired(`Token expired, new token generated and sent by email`);
    }

    const comparePassword = await compareHashedData(newPassword, user.password)
    if(comparePassword) {
        throw new SamePassword('Cant enter the same password as before');
    }

    const hashPassword = await hashData(newPassword);

    const userUpdate = await sessionsRepository.resetPassword(user, hashPassword);

    return userUpdate;
}

export const getById = async (uid) =>{
    const user = await sessionsRepository.getById(uid)
    if(!user){
        throw new ResultNotFound('User not found');
    }
    return user;
}

export const updateUserRol = async (uid, rol) => {
    const updateUserRol = await sessionsRepository.updateUserRol(uid, rol);
    return updateUserRol;
}; 

export const saveDocuments = async (uid, documents) => {
    const uploaderDocuments =  await sessionsRepository.saveDocuments(uid, documents);
    return uploaderDocuments;
}

export const updateLastConnection = async (email) => {
    const updateLastConnection =  await sessionsRepository.updateLastConnection(email);
    return updateLastConnection;
}

export const getUsers = async () => {
    const users =  await sessionsRepository.getUsers();
    if(!users){
        throw new ResultNotFound('Users not found');
    }
    return users;
}

export const deleteUsersInactive = async () => {
    const currentTime = new Date();
    const users =  await sessionsRepository.getUsers();
    if(!users){
        throw new ResultNotFound('Users not found');
    }
    
    const inactiveUsers = [];

    users.forEach(user => {
        const lastActivityTime = user.last_connection;
    
        const timeDifferenceInMinutes = Math.floor((currentTime - lastActivityTime) / (1000 * 60));
    
        if (timeDifferenceInMinutes >= 2880) {
            sessionsRepository.deleteUsers(user._id.toString());
            const email = {
                to: user.email,
                subject:  'Usuario eliminado', 
                html: DeleteUserNotification
            }
            sendEmail(email);
            inactiveUsers.push(user.email);
        }
    });

    return inactiveUsers; 
}

export const deleteUserId = async (uid) => {
    const result =  await sessionsRepository.deleteUsers(uid);
    return result
}

export const updateCart = async (email, cart) => {
    const result = await sessionsRepository.updateCart(email, cart);
    return result; 
}