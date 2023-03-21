import { Router } from 'express';
// import Manager from '../../dao/fileManagers/Manager.js';
import __dirname from '../../utils.js';
import Products from '../../dao/dbManagers/products.js'

const router = Router();

const productsManager = new Products();
// const manager = new Manager(`${__dirname}/files/productos.json`);

router.get('/', async (req, res) => {
    // const products = await manager.getAll();

    const products = await productsManager.getAll(); 
    res.render('home', {products, style: 'home.css'});
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
});

router.get('/chat', (req, res) => {
    res.render('chat', {style: 'chat.css'})
});

export default router;
