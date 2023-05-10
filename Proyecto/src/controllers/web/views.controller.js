import * as viewsService from '../../services/views.service.js';

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products'); 
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login'); 
    next();
}

const privateUserAccess = (req, res, next) => {
    // if (!req.session.user) return res.redirect('/login'); 
    if (req.session.user.rol != "user") return res.redirect('/products');
    next();
}

const privateAdminAccess = (req, res, next) => {
    // if (!req.session.user) return res.redirect('/login'); 
    if (req.session.user.rol != "Admin") return res.redirect('/products');
    next();
}

const getAllProducts = async (req, res) => {
    try {
        const products = await viewsService.getAllProducts(); 
        res.render('home', {products, style: 'home.css'});
    } catch (error) {
        res.status(500).send({error});
    }
};

const saveDeleteProductsSocket = async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
};

const chat = (req, res) => {
    console.log(req.session.user.rol)
    res.render('chat', {style: 'chat.css'})
};

const getProductsPaginate = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category, stock} = req.query;

        const result = await viewsService.getProductsPaginate(limit, page, sort, category, stock)

        res.render('products', {
            products : result.docs, 
            hasPrevPage : result.hasPrevPage,
            prevPage : result.prevPage,
            hasNextPage : result.hasNextPage,
            nextPage : result.nextPage,
            Page : result.page,
            user: req.session.user, 
            style: 'home.css'
        });
    } catch (error) {
        res.status(500).send({error});
    }
};

const getCart = async (req, res) => {
    try {
        let cid = req.session.user.cart;

        const cart = await viewsService.getCart(cid);

        res.render('cart', {cart, style: 'cart.css'})
    } catch (error) {
        res.status(500).send({error});
    }
};

const register = (req, res) => {
    res.render('register', { style: 'register.css' });
};

const login = (req, res) => {
    res.render('login', { style: 'login.css' });
};

const profile = (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
};

export { 
    publicAccess, 
    privateAccess, 
    privateUserAccess, 
    privateAdminAccess,
    getAllProducts, 
    saveDeleteProductsSocket, 
    chat, 
    getProductsPaginate, 
    getCart, 
    register, 
    login, 
    profile
}