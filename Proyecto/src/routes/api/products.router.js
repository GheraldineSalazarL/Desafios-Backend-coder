import { __dirname } from '../../utils.js';
import { deleteProduct, getProduct, getProductsPaginate, saveProduct, updateProduct } from '../../controllers/api/products.controller.js';
import Router from './router.js'

export default class ProductsRouter extends Router{
    init(){
        this.get('/', ['PUBLIC'], getProductsPaginate); 
        this.get('/:pid', ['PUBLIC'], getProduct); 
        this.post('/', ['ADMIN', 'PREMIUM'], saveProduct); 
        this.put('/:pid', ['ADMIN', 'PREMIUM'], updateProduct); 
        this.delete('/:pid', ['ADMIN', 'PREMIUM'], deleteProduct); 
    }
}