// import { Router } from 'express'
import { __dirname} from '../../utils.js';
import { saveCart, getCart, saveProductToCart, deleteProductToCart, updateCart, updateQuantityProductToCart, deleteAllProductsToCart, saveProductToCartSession, purchaseCart } from '../../controllers/api/carts.controller.js';
import Router from './router.js'

export default class CartsRouter extends Router{
    init(){
        this.post('/', ['PUBLIC'], saveCart); 
        this.get('/:cid', ['PUBLIC'], getCart); 
        this.post('/:cid/product/:pid', ['USER'], saveProductToCart); 
        this.delete('/:cid/product/:pid', ['PUBLIC'], deleteProductToCart); 
        this.put('/:cid', ['PUBLIC'], updateCart); 
        this.put('/:cid/product/:pid', ['PUBLIC'], updateQuantityProductToCart); 
        this.delete('/:cid', ['PUBLIC'], deleteAllProductsToCart); 
        this.post('/cart/add/:id', ['USER', 'PREMIUM'], saveProductToCartSession); 
        this.post('/:cid/purchase', ['USER'], purchaseCart); 
    }
}