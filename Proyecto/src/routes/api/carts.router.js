import { Router } from 'express'
// import Manager from '../../dao/fileManagers/Manager.js';
import { __dirname} from '../../utils.js';
// import Carts from '../../dao/dbManagers/carts.js' 
import { saveCart, getCart, saveProductToCart, deleteProductToCart, updateCart, updateQuantityProductToCart, deleteAllProductsToCart, saveProductToCartSession } from '../../controllers/api/carts.controller.js';

const router = Router();

router.post('/', saveCart); 
router.get('/:cid', getCart); 
router.post('/:cid/product/:pid', saveProductToCart); 
router.delete('/:cid/product/:pid', deleteProductToCart); 
router.put('/:cid', updateCart); 
router.put('/:cid/product/:pid', updateQuantityProductToCart); 
router.delete('/:cid', deleteAllProductsToCart); 
router.post('/cart/add/:id', saveProductToCartSession); 

export default router;