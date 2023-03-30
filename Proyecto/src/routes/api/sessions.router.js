import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'fail-register' }), async (req, res) => {
    res.send({ status: 'success', message: 'User registered' })
});

router.get('/fail-register', async (req, res) => {
    res.send({ status: 'error', message: 'Register failed' });
});

router.post('/login', passport.authenticate('login', { failureRedirect: 'fail-login' }), async (req, res) => {
    if (!req.user) return res.status(400)
        .send({ status: 'error', message: 'Invalid credentials' });

    // let rol;
    // if(req.user.email.slice(0,5) === 'admin' && req.user.password === 'adminCod3r123') rol = 'admin';
    // else rol = 'usuario';

    // delete req.user.password; 

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        // rol: rol
    }

    res.send({ status: 'success', message: 'login success' });
});

router.get('/fail-login', async (req, res) => {
    res.send({ status: 'error', message: 'login failed' });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send({ status: 'succes', message:'user Registered'});
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        // rol: rol
    }

    res.redirect('/products');   
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: 'error', error: 'couldnt logout' });
        res.redirect('/products');
    })
});

export default router;