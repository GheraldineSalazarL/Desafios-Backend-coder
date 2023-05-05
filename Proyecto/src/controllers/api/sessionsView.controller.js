import * as sessionsViewService from '../../services/sessionsView.service.js';

const register = async (req, res) => {
    res.send({ status: 'success', message: 'User registered' })
};

const failRegister = async (req, res) => {
    res.send({ status: 'error', message: 'Register failed' });
};

const login = async (req, res) => {
    if (!req.user) return res.status(400)
        .send({ status: 'error', message: 'Invalid credentials' });

    const result = await sessionsViewService.login(req);
    req.session.user = result;
    res.send({ status: 'success', message: 'login success' });
};

const failLogin = async (req, res) => {
    res.send({ status: 'error', message: 'login failed' });
};

const authGithub = async (req, res) => {
    res.send({ status: 'succes', message:'user Registered'});
};

const authGithubCallback =  (req, res) => {
    
    const result = sessionsViewService.authGithubCallback(req);
    req.session.user = result;
    
    res.redirect('/products');   
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: 'error', error: 'couldnt logout' });
        res.redirect('/products');
    })
};

export {
    register, 
    failRegister, 
    login, 
    failLogin, 
    authGithub, 
    authGithubCallback, 
    logout
}