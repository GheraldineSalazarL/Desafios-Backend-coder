import Products from '../../dao/dbManagers/products.js'
import Carts from '../../dao/dbManagers/carts.js';

const productsManager = new Products();
const cartsManager = new Carts();

const getAllProducts = async (req, res) => {
    // const products = await manager.getAll();

    const products = await productsManager.getAll(); 
    res.render('home', {products, style: 'home.css'});
};

const saveDeleteProductsSocket = async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
};

const chat = (req, res) => {
    res.render('chat', {style: 'chat.css'})
};

const getProductsPaginate = async (req, res) => {
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
};

const getCart = async (req, res) => {
    let cid = req.session.user.cart;

    const cart = await cartsManager.getById(cid);

    res.render('cart', {cart, style: 'cart.css'})
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
    getAllProducts, 
    saveDeleteProductsSocket, 
    chat, 
    getProductsPaginate, 
    getCart, 
    register, 
    login, 
    profile
}