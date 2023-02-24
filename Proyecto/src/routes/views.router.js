import { Router } from 'express';
import Manager from '../Manager.js';
import __dirname from '../utils.js';


const router = Router();

const manager = new Manager(`${__dirname}/files/productos.json`);

router.get('/', async (req, res) => {
    const products = await manager.getAll();
    res.render('home', {products, style: 'home.css'});
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {style: 'realTimeProducts.css'});
});

export default router;
