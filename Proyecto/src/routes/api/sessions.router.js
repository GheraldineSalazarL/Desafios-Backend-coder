import { login, register, logout, forgotPassword, resetPassword } from '../../controllers/api/sessions.controller.js';
import Router from './router.js';
export default class SessionRouter extends Router{
    init(){
        this.post('/register', ['PUBLIC'], register);
        this.post('/login', ['PUBLIC'], login);
        this.get('/logout', ['PUBLIC'], logout);
        this.post('/forgot-password', ['PUBLIC'], forgotPassword);
        this.post('/reset-password', ['PUBLIC'], resetPassword);
    }
}
