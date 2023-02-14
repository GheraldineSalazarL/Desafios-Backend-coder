import { Router } from 'express'
import Manager from '../Manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const manager = new Manager(path.join(dirname, '../files/carritos.json'));

// router.get('/', async (req, res) => {
//     const carts = await manager.getAll();
//     res.send({carts});
// });

router.post('/', async (req, res) => {
    const cart = { products: [] }

    await manager.save(cart);

    res.send({status: 'sucess', message:'Carrito creado'});
});

router.get('/:cid', async(req,res)=> {
    const cid = Number(req.params.cid);

    const cart = await manager.getById(cid);

    cart ? res.send(cart.products) : res.send({status: 'error', message:`Carrito no encontrado`})
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    const resp = await manager.saveId(cid, pid);

    if(resp === "not found") {return res.send({status: 'error', message:`Carrito no encontrado`})};
    if(resp === "success") {return res.send({status: 'sucess', message:'Producto agregado al carrito'})};
});

export default router;