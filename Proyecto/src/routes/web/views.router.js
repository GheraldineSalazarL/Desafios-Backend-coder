import { Router } from 'express';
import { __dirname } from '../../utils.js';
import { chat, getAllProducts, getCart, getProductsPaginate, login, privateAccess, privateUserAccess, privateAdminAccess, privateAdminPremiumAccess, profile, publicAccess, register, saveDeleteProductsSocket, forgotPassword, resetPassword, usersView } from '../../controllers/web/views.controller.js';
import { mockingProducts } from '../../controllers/web/mockingProducts.controllers.js';

const router = Router();

router.get('/login', publicAccess, login); 
router.get('/register', publicAccess, register); 
router.get('/forgotPassword', publicAccess, forgotPassword); 
router.get('/resetPassword', publicAccess, resetPassword); 
router.get('/products', privateAccess, getProductsPaginate); 
router.get('/realtimeproducts', privateAdminPremiumAccess, saveDeleteProductsSocket); 
router.get('/chat', privateUserAccess, chat); 
router.get('/cart', privateAccess, getCart); 
router.get('/profile', privateAccess, profile); 
router.get('/users', privateAdminAccess, usersView); 

router.get('/', privateAccess, getAllProducts); 

router.use('/mockinkg-products', mockingProducts);


export default router;
