import { __dirname} from '../../utils.js';
import { saveCart, getCart, saveProductToCart, deleteProductToCart, updateCart, updateQuantityProductToCart, deleteAllProductsToCart, saveProductToCartSession, purchaseCart } from '../../controllers/api/carts.controller.js';
import Router from './router.js'

export default class CartsRouter extends Router{
    init(){
        this.post('/', ['PUBLIC'], saveCart); 
        this.get('/:cid', ['PUBLIC'], getCart); 
        this.post('/:cid/product/:pid', ['USER'], saveProductToCart); //Agregar un producto dentro de un carrito específico (cid)
        this.delete('/:cid/product/:pid', ['USER', 'PREMIUM'], deleteProductToCart); 
        this.put('/:cid', ['PUBLIC'], updateCart); 
        this.put('/:cid/product/:pid', ['PUBLIC'], updateQuantityProductToCart); 
        this.delete('/:cid', ['PUBLIC'], deleteAllProductsToCart); 
        this.post('/cart/add/:id', ['USER', 'PREMIUM'], saveProductToCartSession);   //agregar un producto dentro del carrito de mi usuario logeado
        this.post('/:cid/purchase', ['USER', 'PREMIUM'], purchaseCart); 
    }
}