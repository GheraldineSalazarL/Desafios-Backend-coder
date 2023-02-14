import { Router } from 'express'
import Manager from '../Manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const manager = new Manager(path.join(dirname, '../files/carritos.json'));

router.get('/', async (req, res) => {
    const carts = await manager.getAll();
    res.send({carts});
});

router.post('/', async (req, res) => {
    const cart = req.body

    // if(carts.length === 0){
    //     cart.id = 1;
    // } else{
    //     cart.id =  carts[carts.length -1].id + 1;
    // }

    if(typeof cart.products !== "object"){return res.send({status: 'error', message:'products debe ser un array'})}

    await manager.save(cart);

    res.send({status: 'sucess', message:'Carrito creado'});
});

router.get('/:cid', async(req,res)=> {
    const cid = Number(req.params.cid);
    
    // const index=carts.findIndex(c=>c.id===cid); 
    // if(index === -1) { 
    //     res.send({status: 'error', message:`Carrito no encontrado`})
    //     return;
    // }

    const cart = await manager.getById(cid);

    cart ? res.send(cart.products) : res.send({status: 'error', message:`Carrito no encontrado`})
});

router.post('/:cid/product/:pid', async (req, res) => {
    const prod = req.body
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    // const indexC=carts.findIndex(c=>c.id===cid); 
    // if(indexC === -1) { 
    //     res.send({status: 'error', message:`Carrito no encontrado`})
    //     return;
    // };
    // const cart = carts[indexC]

    // const products = cart.products

    // const indexP=products.findIndex(p=>p.product===pid); 
    // if(indexP === -1) { 
    //     const product = {
    //         "product": pid,
    //         "quantity": prod.quantity
    //     }
    //     products.push(product);
    //     await promises.writeFile(path, JSON.stringify(products, null, '\t'));
    //     res.send({status: 'sucess', message:'Producto creado dentro del carrito'});
    // }else {
    //     const newProduct = {
    //         ...products[indexP],
    //         "quantity": products[indexP].quantity + prod.quantity
    //     }
    //     products[indexP] = newProduct;
    //     await promises.writeFile(path, JSON.stringify(products[indexP], null, '\t'));
    //     res.send({status: 'sucess', message:'Producto actualizado dentro del carrito'});
    // };

    const resp = await manager.saveId(cid, prod, pid);

    if(resp = "not found") {return res.send({status: 'error', message:`Carrito no encontrado`})};
    if(resp = "product") {return res.send({status: 'sucess', message:'Producto creado dentro del carrito'})};
    if(resp = "newProduct") {return res.send({status: 'sucess', message:'Producto actualizado dentro del carrito'})};
});

export default router;