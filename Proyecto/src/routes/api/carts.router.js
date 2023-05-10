// import { Router } from 'express'
import { __dirname} from '../../utils.js';
import { saveCart, getCart, saveProductToCart, deleteProductToCart, updateCart, updateQuantityProductToCart, deleteAllProductsToCart, saveProductToCartSession } from '../../controllers/api/carts.controller.js';
import Router from './router.js'

// const router = Router();

// router.post('/', saveCart); 
// router.get('/:cid', getCart); 
// router.post('/:cid/product/:pid', saveProductToCart); 
// router.delete('/:cid/product/:pid', deleteProductToCart); 
// router.put('/:cid', updateCart); 
// router.put('/:cid/product/:pid', updateQuantityProductToCart); 
// router.delete('/:cid', deleteAllProductsToCart); 
// router.post('/cart/add/:id', saveProductToCartSession); 

// export default router;

export default class CartsRouter extends Router{
    init(){
        this.post('/', ['PUBLIC'], saveCart); 
        this.get('/:cid', ['PUBLIC'], getCart); 
        this.post('/:cid/product/:pid', ['PUBLIC'], saveProductToCart); 
        this.delete('/:cid/product/:pid', ['PUBLIC'], deleteProductToCart); 
        this.put('/:cid', ['PUBLIC'], updateCart); 
        this.put('/:cid/product/:pid', ['PUBLIC'], updateQuantityProductToCart); 
        this.delete('/:cid', ['PUBLIC'], deleteAllProductsToCart); 
        this.post('/cart/add/:id', ['PUBLIC'], saveProductToCartSession); 
    }
}