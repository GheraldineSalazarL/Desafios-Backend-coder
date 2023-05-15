import { Router } from 'express';
import { __dirname } from '../../utils.js';
import { chat, getAllProducts, getCart, getProductsPaginate, login, privateAccess, privateUserAccess, privateAdminAccess, profile, publicAccess, register, saveDeleteProductsSocket } from '../../controllers/web/views.controller.js';
import { mockingProducts } from '../../controllers/web/mockingProducts.controllers.js';

const router = Router();

router.get('/', privateAccess, getAllProducts); 
router.get('/realtimeproducts', privateAdminAccess, saveDeleteProductsSocket); 
router.get('/chat', privateUserAccess, chat); 
router.get('/products', privateAccess, getProductsPaginate); 
router.get('/cart', privateAccess, getCart); 
router.get('/register', publicAccess, register); 
router.get('/login', publicAccess, login); 
router.get('/profile', privateAccess, profile); 
router.use('/mockinkg-products', mockingProducts)


export default router;
