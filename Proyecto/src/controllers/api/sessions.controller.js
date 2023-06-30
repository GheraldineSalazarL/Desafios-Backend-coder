import CustomError from '../../services/errors/CustomError.js';
import * as sessionsService from '../../services/sessions.service.js';
import { IncorrectLoginCredentials, InputIncomplete, ResultNotFound, TokenExpired } from '../../utils/customExceptions.js';

// const register = async (req, res) => {
//     try{
//         const { first_name, last_name, email, age, password, rol } = req.body;

//         if(!first_name || !last_name || !email || !age || !password || !rol ){
//             return res.sendClientError('incomplete values');
//         }

//         const user = { first_name, last_name, email, age, password, rol };
        
//         const result = await sessionsService.register(user);

//         if(result==='exist'){
//             return res.sendClientError('User already exists');
//         }
//         res.sendSuccess(result); 
//         req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
        
//     } catch(error){
//         req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
//         res.sendServerError(error);
//     }
// }

const register = async (req, res) => {
    try{
        const { first_name, last_name, email, age, password, rol } = req.body;

        if(!first_name || !last_name || !email || !age || !password || !rol ){
            return res.sendClientError('incomplete values');
        }

        const user = { first_name, last_name, email, age, password, rol };
        
        const userDB = await sessionsService.getByEmailRegister(user.email);

        if(userDB){
            return res.sendClientError('User already exists');
        }

        const result = await sessionsService.register(user);

        res.sendSuccess(result); 
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
        
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        res.sendServerError(error);
    }
}

// const login = async (req, res) => {
//     try{
//         const { email, password } = req.body;

//         const result= await sessionsService.login(email, password);
        
//         if(result === 'notCredentials') 
//             return res.sendClientError('Incorrect credentials'); 
        
//         if(!result) return res.sendClientError('Incorrect credentials'); 
        
//         res.cookie('token', result, { httpOnly: true });
//         res.sendSuccess({result}); 
//         req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

//     } catch(error){
//         req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
//         res.sendServerError(error);
//     }
// };

const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user= await sessionsService.getByEmail(email);
        
        const result = await sessionsService.login(user, password);

        res.cookie('token', result, { httpOnly: true });

        await sessionsService.updateLastConnection(user.email);

        res.sendSuccess({result}); 
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message); 
        }

        if(error instanceof IncorrectLoginCredentials){
            return res.sendClientError(error.message); 
        }

        res.sendServerError(error);
    }
};

const logout = async (req, res) => {
    try{
        await sessionsService.updateLastConnection(req.session.user.email);
        res.clearCookie('token');
        req.session.destroy(err => {
        if (err) return res.status(500).send({ status: 'error', error: 'couldnt logout' });
            res.redirect('/login');
        })
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        res.sendServerError(error);
    }
};

const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;

        if (email === "") {
            res.sendClientError('email incomplete')
            throw new InputIncomplete('Email incomplete');
        }

        const user= await sessionsService.getByEmail(email);

        const result = await sessionsService.forgotPassword(user);

        res.sendSuccess(`Password reset mail sent of ${result}`);  
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message); 
        }
        if(error instanceof InputIncomplete){
            return res.sendClientError(error.message); 
        }

        res.sendServerError(error);
    }
};

const resetPassword = async (req, res) => {
    try{
        const userToken =  req.body.userToken;
        const newPassword = req.body.newPassword;

        if (newPassword === "") {
             res.sendClientError('Password incomplete');
             throw new InputIncomplete('Password incomplete');
        }

        const userResetPasswordDB= await sessionsService.getUserResetPassword(userToken, newPassword);

        res.sendSuccess("Password update"); 

    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if(error instanceof InputIncomplete){
            return res.sendClientError(error.message); 
        }
        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message); 
        }
        if(error instanceof TokenExpired){
            return res.sendClientError(error.message); 
        }

        res.sendServerError(error);
    }
};

export { 
    register,
    login, 
    logout,
    forgotPassword,
    resetPassword
}