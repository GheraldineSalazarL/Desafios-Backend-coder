import { Router } from 'express';
import Manager from '../../dao/fileManagers/Manager.js';
import { __dirname } from '../../utils.js';
import Products from '../../dao/dbManagers/products.js'
import Carts from '../../dao/dbManagers/carts.js';
// import { chat, getAllProducts, getCart, getProductsPaginate, login, profile, register, saveDeleteProductsSocket } from '../../controllers/web/views.controller.js';
const router = Router();

// router.get('/', privateAccess, getAllProducts); 
// router.get('/realtimeproducts', privateAccess, saveDeleteProductsSocket); 
// router.get('/chat', privateAccess, chat); 
// router.get('/products', privateAccess, getProductsPaginate); 
// router.get('/cart', privateAccess, getCart); 
// router.get('/register', publicAccess, register); 
// router.get('/login', publicAccess, login); 
// router.get('/profile', privateAccess, profile); 

const productsManager = new Products();
const cartsManager = new Carts();
// const manager = new Manager(`${__dirname}/files/productos.json`);

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products'); 
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login'); 
    next();
}

router.get('/', privateAccess, async (req, res) => {
    // const products = await manager.getAll();

    const products = await productsManager.getAll(); 
    res.render('home', {products, style: 'home.css'});
});

router.get('/realtimeproducts', privateAccess, async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
});

router.get('/chat', privateAccess, (req, res) => {
    res.render('chat', {style: 'chat.css'})
});

// let cartId;
router.get('/products', privateAccess, async (req, res) => {
    const { limit = 10, page = 1, sort, category, stock} = req.query;

    let query = {};
    if(category) query = {category : `${category}`};
    if(stock) query = {stock : `${stock}`};
    if(category && stock) query = {$and: [ {category : `${category}`},{stock : `${stock}`} ]}  

    const result = await productsManager.getAllPage(limit, page, sort, query)

    // const cartId = req.session.user.cart;
    const products = result.docs; 
    const hasPrevPage = result.hasPrevPage;
    const prevPage = result.prevPage;
    const hasNextPage = result.hasNextPage;
    const nextPage = result.nextPage;
    const Page = result.page;
    res.render('products', {products, hasPrevPage, prevPage, hasNextPage,  nextPage, Page, user: req.session.user, style: 'home.css'})
});

router.get('/cart', privateAccess, async (req, res) => {
    let cid = req.session.user.cart;

    const cart = await cartsManager.getById(cid);

    res.render('cart', {cart, style: 'cart.css'})
});

router.get('/register', publicAccess, (req, res) => {
    res.render('register', { style: 'register.css' });
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login', { style: 'login.css' });
});

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
});

export default router;
