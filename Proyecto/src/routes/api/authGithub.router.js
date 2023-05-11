import { Router } from 'express';
import passport from 'passport';
import { authGithub, authGithubCallback } from '../../controllers/api/authGithub.controller.js';

const router = Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), authGithub); 
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), authGithubCallback); 

export default router
