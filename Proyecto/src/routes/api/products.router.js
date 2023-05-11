// import { Router } from 'express';
import { __dirname } from '../../utils.js';
import { deleteProduct, getProduct, getProductsPaginate, saveProduct, updateProduct } from '../../controllers/api/products.controller.js';
import Router from './router.js'

// const router = Router();

// router.get('/', getProductsPaginate); 
// router.get('/:pid', getProduct); 
// router.post('/', saveProduct); 
// router.put('/:pid', updateProduct); 
// router.delete('/:pid', deleteProduct); 

// export default router;

export default class CartsRouter extends Router{
    init(){
        this.get('/', ['PUBLIC'], getProductsPaginate); 
        this.get('/:pid', ['PUBLIC'], getProduct); 
        this.post('/', ['ADMIN'], saveProduct); 
        this.put('/:pid', ['ADMIN'], updateProduct); 
        this.delete('/:pid', ['ADMIN'], deleteProduct); 
    }
}