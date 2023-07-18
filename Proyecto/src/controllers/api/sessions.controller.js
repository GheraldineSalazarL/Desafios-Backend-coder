import * as sessionsService from '../../services/sessions.service.js';
import { IncorrectLoginCredentials, InputIncomplete, ResultNotFound, SamePassword, TokenExpired, UserExists } from '../../utils/customExceptions.js';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const PRIVATE_KEY = config.secret;

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, rol } = req.body;

        if (!first_name || !last_name || !email || !age || !password || !rol) {
            throw new InputIncomplete('incomplete values');
        }

        const user = { first_name, last_name, email, age, password, rol };

        const userDB = await sessionsService.getByEmailRegister(user.email);

        if (userDB) {
            throw new UserExists('User already exists');
        }

        const result = await sessionsService.register(user);

        res.sendSuccess(result);
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if (error instanceof UserExists) {
            return res.sendClientError(error.message);
        }
        if (error instanceof InputIncomplete) {
            return res.sendClientError(error.message);
        }

        res.sendServerError(error);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await sessionsService.getByEmail(email);

        const result = await sessionsService.login(user, password);

        res.cookie('token', result, { httpOnly: true });

        await sessionsService.updateLastConnection(user.email);

        res.sendSuccess({ result });
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if (error instanceof ResultNotFound) {
            return res.sendClientError(error.message);
        }

        if (error instanceof IncorrectLoginCredentials) {
            return res.sendClientError(error.message);
        }

        res.sendServerError(error);
    }
};

const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, PRIVATE_KEY);

        await sessionsService.updateLastConnection(decodedToken.email);
        res.clearCookie('token');
        req.session.destroy(err => {
            if (err) return res.sendServerError('couldnt logout');
            res.redirect('/login');
        })
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        res.sendServerError(error);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (email === "") {
            throw new InputIncomplete('Email incomplete');
        }

        const user = await sessionsService.getByEmail(email);

        const result = await sessionsService.forgotPassword(user);

        res.sendSuccess(`Password reset mail sent of ${result}`);
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);

    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if (error instanceof ResultNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof InputIncomplete) {
            return res.sendClientError(error.message);
        }

        res.sendServerError(error);
    }
};

const resetPassword = async (req, res) => {
    try {
        const userToken = req.body.userToken;
        const newPassword = req.body.newPassword;

        if (newPassword === "") {
            throw new InputIncomplete('Password incomplete');
        }

        const userResetPasswordDB = await sessionsService.getUserResetPassword(userToken);
        if (!userResetPasswordDB) {
            throw new TokenExpired('Token is invalid or has expired');
        }

        const userDB = await sessionsService.getById(userResetPasswordDB.user);

        const result = await sessionsService.resetPassword(userDB, userResetPasswordDB, newPassword);

        res.sendSuccess("Password update");

    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if (error instanceof InputIncomplete) {
            return res.sendClientError(error.message);
        }
        if (error instanceof ResultNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof TokenExpired) {
            return res.sendClientError(error.message);
        }
        if (error instanceof SamePassword) {
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