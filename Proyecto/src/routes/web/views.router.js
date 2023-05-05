import { Router } from 'express';
// import Manager from '../../dao/fileManagers/Manager.js';
import { __dirname } from '../../utils.js';
// import Products from '../../dao/dbManagers/products.js'
// import Carts from '../../dao/dbManagers/carts.js';
import { chat, getAllProducts, getCart, getProductsPaginate, login, privateAccess, profile, publicAccess, register, saveDeleteProductsSocket } from '../../controllers/web/views.controller.js';

const router = Router();

router.get('/', privateAccess, getAllProducts); 
router.get('/realtimeproducts', privateAccess, saveDeleteProductsSocket); 
router.get('/chat', privateAccess, chat); 
router.get('/products', privateAccess, getProductsPaginate); 
router.get('/cart', privateAccess, getCart); 
router.get('/register', publicAccess, register); 
router.get('/login', publicAccess, login); 
router.get('/profile', privateAccess, profile); 

export default router;
