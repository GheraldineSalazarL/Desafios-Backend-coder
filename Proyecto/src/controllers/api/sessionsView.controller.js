
const register = async (req, res) => {
    res.send({ status: 'success', message: 'User registered' })
};

const failRegister = async (req, res) => {
    res.send({ status: 'error', message: 'Register failed' });
};

const login = async (req, res) => {
    if (!req.user) return res.status(400)
        .send({ status: 'error', message: 'Invalid credentials' });

    let rol;
    if(req.user.email.slice(0,5) === 'admin') rol = 'admin';
    else rol = 'usuario';

    delete req.user.password; 

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        rol: rol
    }

    res.send({ status: 'success', message: 'login success' });
};

const failLogin = async (req, res) => {
    res.send({ status: 'error', message: 'login failed' });
};

const authGithub = async (req, res) => {
    res.send({ status: 'succes', message:'user Registered'});
};

const authGithubCallback = (req, res) => {
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        // rol: rol
    }

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