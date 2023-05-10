
export const login = async (req) => {
    // let rol;
    // if(req.user.email.slice(0,5) === 'admin') rol = 'admin';
    // else rol = 'usuario';

    delete req.user.password; 

    req.session.user = {
        name: `${req.user.name}`,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }

    return req.session.user; 
};

export const authGithubCallback = (req, res) => {
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        // rol: rol
    }

    return req.session.user;  
};
