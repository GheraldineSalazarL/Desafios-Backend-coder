import { Router } from 'express'
// import Manager from '../../dao/fileManagers/Manager.js';
import { __dirname } from '../../utils.js';
import { deleteProduct, getProduct, getProductsPaginate, saveProduct, updateProduct } from '../../controllers/api/products.controller.js';
// import Products from '../../dao/dbManagers/products.js';

const router = Router();

router.get('/', getProductsPaginate); 
router.get('/:pid', getProduct); 
router.post('/', saveProduct); 
router.put('/:pid', updateProduct); 
router.delete('/:pid', deleteProduct); 

export default router;