import UsersDto from '../dao/DTOs/users.dto.js';
import SessionsRepository from '../repository/sessions.repository.js';
import { compareHashedData, generateToken, hashData } from '../utils.js';
import { IncorrectLoginCredentials, ResultNotFound, SamePassword, TokenExpired } from '../utils/customExceptions.js';
import { loginNotification, registerNotification } from '../utils/customHTML.js';
import { sendEmail } from './mail.service.js';
import bcrypt from 'bcrypt';


const sessionsRepository = new SessionsRepository();

export const register = async (user) => {
    // const result = await sessionsRepository.register(user);

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
    // const result = await sessionsRepository.login(email, password);

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
    const  Hash = await bcrypt.hash(user.email, 1);
    const userHash = Buffer.from(Hash).toString('base64');

    const resetPassword = {
        "user" : user._id,
        "token" : userHash
    }
    
    const result = await sessionsRepository.forgotPassword(resetPassword);

    const email = {
        to: user.email,
        subject:  'Recuperación de contraseña', 
        html: 
            `<!DOCTYPE html>
            <html>
            <head>
                <title>Recuperación de Contraseña</title>
                <style>
                    .container {
                        width: 300px;
                        padding: 20px;
                        background-color: #f0f0f0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        text-align: center;
                        margin: 0 auto;
                        margin-top: 50px;
                    }
            
                    .success {
                        color: #008000;
                        font-size: 18px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 class="success">Recuperación de contraseña</h2>
                    <p>Para recuperar la contraseña haga click en el enlace</p>
                    <a href="http://localhost:8080/resetPassword?token=${userHash}"> <button> Recuperar Contraseña </button> </a>
                </div>
            </body>
            </html>`
            // <a href="http://localhost:8080/api/sessions/reset-password/${userHash}"> <button> Recuperar Contraseña </button> </a>
    }
    await sendEmail(email);

    return result; 
}

export const getUserResetPassword = async (userToken, newPassword) => {
    const userResetPasswordDB = await sessionsRepository.getUserResetPassword(userToken);
    if(!userResetPasswordDB){
        throw new ResultNotFound('Token is invalid or has expired');
    }

    const userDB = await sessionsRepository.getUserDB(userResetPasswordDB.user);
    if(!userDB){
        throw new ResultNotFound('User not found');
    }

    const tokenExpiration = 3600000 ; // 1 hora en milisegundos
    const currentTime = new Date().getTime();
    const tokenCreatedAt = userResetPasswordDB.createdAt.getTime();
    const obj = {"email" : userDB.email};
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

    const comparePassword = await compareHashedData(newPassword, userDB.password)
    if(comparePassword) {
        throw new SamePassword('Cant enter the same password as before');
    }

    const hashPassword = await hashData(newPassword);

    const userUpdate = await sessionsRepository.resetPassword(userDB, hashPassword);

    return userUpdate;
};

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