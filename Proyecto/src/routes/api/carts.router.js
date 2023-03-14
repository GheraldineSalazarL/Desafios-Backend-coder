import { Router } from 'express'
import Manager from '../../dao/fileManagers/Manager.js';
import __dirname from '../../utils.js';
import Carts from '../../dao/dbManagers/carts.js' 

const router = Router();

const cartsManager = new Carts();

const manager = new Manager(`${__dirname}/files/carritos.json`);

// router.get('/', async (req, res) => {
//     const carts = await manager.getAll();
//     res.send({carts});
// });

router.post('/', async (req, res) => {
    const cart = { products: [] }

    try{
        const result = await cartsManager.save(cart);
        res.send({status: 'sucess', message:'Carrito creado', payload: result});
    } catch(error){
        res.status(500).send({error});
    }

    await manager.save(cart); 
});

router.get('/:cid', async(req,res)=> {
    const cid = Number(req.params.cid);

    // await manager.getById(cid)

    try{
        const cart = await cartsManager.getById(cid);

        cart ? res.send(cart.products) : res.send({status: 'error', message:`Carrito no encontrado`})
    } catch(error){
        res.status(500).send({error});
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    try{
        const resp = await cartsManager.saveId(cid, pid);

        resp ?  res.send({status: 'sucess', message:'Producto agregado al carrito'}) : res.send({status: 'error', message: 'Carrito no encontrado'})

    } catch(error){
        res.status(500).send({error});
    }

    await manager.saveId(cid, pid);
});

export default router;