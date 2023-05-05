import { Router } from 'express';
import passport from 'passport';
import { authGithub, authGithubCallback, failLogin, failRegister, login, logout, register } from '../../controllers/api/sessionsView.controller.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'fail-register' }), register); 
router.get('/fail-register', failRegister); 
router.post('/login',  passport.authenticate('login', { failureRedirect: 'fail-login' }), login); 
router.get('/fail-login', failLogin); 
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), authGithub); 
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), authGithubCallback); 
router.get('/logout', logout); 

export default router
