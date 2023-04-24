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

// const cartsManager = new Carts();

// const manager = new Manager(`${__dirname}/files/carritos.json`);

// router.get('/', async (req, res) => {
//     const carts = await cartsManager.getAll();
//     res.send({carts});
// });

// router.post('/', async (req, res) => {

//     try{
//         const result = await cartsManager.save();
//         res.send({status: 'sucess', message:'Carrito creado', payload: result});
//     } catch(error){
//         res.status(500).send({error});
//     }
// });

// router.get('/:cid', async(req,res)=> {
//     const cid = req.params.cid;

//     try{
//         const cart = await cartsManager.getById(cid);
//         cart ? res.send({status: 'sucess', payload: cart.products}) : res.send({status: 'error', message:`Carrito no encontrado`})
//     } catch(error){
//         res.status(500).send({error});
//     }
// });

// router.post('/:cid/product/:pid', async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;

//     try{
//         const resp = await cartsManager.saveId(cid, pid);

//         resp ?  res.send({status: 'sucess', message:'Producto agregado al carrito'}) : res.send({status: 'error', message: 'Carrito no encontrado'})

//     } catch(error){
//         res.status(500).send({error});
//     }

// });

// router.delete('/:cid/product/:pid', async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;

//     try{
//         const resp = await cartsManager.deleteId(cid, pid);
        
//         resp  
//             ? resp === "error" 
//                 ? res.send({status: 'error', message: 'Producto no encontrado dentro del carrito'})
//                 : res.send({status: 'sucess', message:'Producto eliminado del carrito'})
//             : res.send({status: 'error', message: 'Carrito no encontrado'});        
        
//     } catch(error){
//         res.status(500).send({error});
//     }
// });

// router.put('/:cid', async(req,res)=> {
//     const productsUpdate = req.body;
//     const cid = req.params.cid;

//     try{
//         const cart = await cartsManager.update(cid, productsUpdate);
//         cart ? res.send({status: 'sucess', message:`Carrito modificado`}) : res.send({status: 'error', message:`Carrito no encontrado`})
//     } catch(error){
//         res.status(500).send({error});
//     }
// });

// router.put('/:cid/product/:pid', async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const quantityUpdate = req.body;

//     try{
//         const resp = await cartsManager.updateQuantity(cid, pid, quantityUpdate);

//         resp  
//             ? resp === "error" 
//                 ? res.send({status: 'error', message: 'Producto no encontrado dentro del carrito'})
//                 : res.send({status: 'sucess', message:'Cantidad del producto modificado'})
//             : res.send({status: 'error', message: 'Carrito no encontrado'});     

//     } catch(error){
//         res.status(500).send({error});
//     }
// });

// router.delete("/:cid", async (req, res) => {
//     const cid = req.params.cid;

//     try{
//         const resp = await cartsManager.deleteAll(cid);

//         resp ? res.send({status: 'sucess', message:`Productos eliminados del carrito`}) : res.send({status: 'error', message:`Carrito no encontrado`})
//     } catch(error){
//         res.status(500).send({error});
//     }
// });

// router.post('/cart/add/:id', async (req, res) => {
//     const pid = req.params.id;

//     try {
//         let cart;
//         if (!req.session.user.cart) {
//             cart = await cartsManager.save();
//             req.session.user.cart = cart._id;
//         } else {
//             cart = await cartsManager.getById(req.session.user.cart);
//         }

//         const cid = cart._id;
//         await cartsManager.saveId(cid, pid);
//         req.session.user.cart = cart._id;

//         // res.redirect('/products');
//     } catch (err) {
//         console.log(err);
//     }
// });

export default router;