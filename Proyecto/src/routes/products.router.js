import { Router } from 'express'
import Manager from '../Manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const manager = new Manager(path.join(dirname, '../files/productos.json'));

router.get('/', async (req, res) => {
    const products = await manager.getAll();
    const {limit} = req.query;

    if(!limit) return res.send({products});

    const productsFilter = []
    if(limit <= products.length){
        for(var i=0; i<limit; i++){
            productsFilter.push(products[i])
        }
        res.send(productsFilter)
    } else {res.send({status: 'error', message:`Sólo exiten ${products.length} productos`})}
});

router.get('/:pid', async(req,res)=> {
    const pid = Number(req.params.pid);
    const product = await manager.getById(pid);
    
    product ? res.send(product) : res.send({status: 'error', message:`Producto no encontrado`})
})

router.post('/', async (req, res) => {
    const product = req.body;

    if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
        return res.send({status: 'error', message:'Valores incompletos'});
    } 
    if(!product.status){product.status = true};
    if(typeof product.title !== "string"){ return res.send({status: 'error', message:'title debe ser un string'})};
    if(typeof product.description !== "string"){return res.send({status: 'error', message:'description debe ser un string'})};
    if(typeof product.code !== "string"){return res.send({status: 'error', message:'code debe ser un string'})};
    if(typeof product.price !== "number"){return res.send({status: 'error', message:'price debe ser un numérico'})};
    if(typeof product.status !== "boolean"){return res.send({status: 'error', message:'status debe ser un booleano'})};
    if(typeof product.stock !== "number"){return res.send({status: 'error', message:'stock debe ser un numérico'})};
    if(typeof product.category !== "string"){return res.send({status: 'error', message:'category debe ser un string'})};
    if(product.thumbnails){if(typeof product.thumbnails !== "object"){return res.send({status: 'error', message:'thumbnails debe ser un array'})}};

    await manager.save(product);
    res.send({status: 'sucess', message:'Producto creado'});
});

router.put('/:pid', async (req,res)=> {
    const productReq = req.body;
    const pid = Number(req.params.pid);

    if(productReq.id) {return res.send({status: 'error', message:'el id no se puede modificar'})};

    const product = await manager.update(productReq, pid);

    product ? res.send({status: 'sucess', message:'Producto actualizado'}) : res.send({status: 'error', message:`Producto no encontrado`})
});

router.delete('/:pid', async (req,res)=> {
    const pid = Number(req.params.pid);

    const removedProduct = await manager.deleteById(pid)

    removedProduct ?  res.send({status: 'sucess', message:'Producto eliminado'}) : res.send({status: 'error', message: 'Producto no encontrado'})

});

export default router;