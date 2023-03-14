import { Router } from 'express'
import Manager from '../../dao/fileManagers/Manager.js';
import __dirname from '../../utils.js';
import Products from '../../dao/dbManagers/products.js';

const router = Router();

const productsManager = new Products();

const manager = new Manager(`${__dirname}/files/productos.json`);

router.get('/', async (req, res) => {
    const {limit} = req.query;

    try{
        const products = await productsManager.getAll(limit); 
        res.send({ status: 'success', payload: products })

    } catch(error){
        res.status(500).send({error});
    }

    // const products = await manager.getAll();

    // if(!limit) return res.send({products});

    // const productsFilter = []
    // if(limit <= products.length){
    //     for(var i=0; i<limit; i++){
    //         productsFilter.push(products[i])
    //     }
    //     res.send(productsFilter)
    // } else {res.send({status: 'error', message:`Sólo exiten ${products.length} productos`})}
    
});

router.get('/:pid', async(req,res)=> {
    const pid = Number(req.params.pid);

    // const product = await manager.getById(pid);
    const product = await productsManager.getById(pid);
    
    product ? res.send({ status: 'success', payload: product }) : res.send({status: 'error', message:`Producto no encontrado`})
})

router.post('/', async (req, res) => {
    const { title,description,code,price,status,stock,category,thumbnails,id } = req.body;

    if(!title || !description || !code || !price || !stock || !category){
        return res.status(400).send({status: 'error', message:'Valores incompletos'});
    } 
    
    try{
        const result = await productsManager.save({
            title,
            description,
            code,
            price,
            status,
            stock, 
            category,
            thumbnails,
            id
        });

        res.send({ result: 'success', payload: result});
    }catch(error){
        res.status(500).send({error});
    }

    const product = req.body;
    if(!product.status) {product.status = true};
    if(!product.thumbnails) {product.thumbnails = []}

    await manager.save(product);
});

router.put('/:pid', async (req,res)=> {
    const productReq = req.body;
    const pid = Number(req.params.pid);

    if(productReq.id) {return res.send({status: 'error', message:'el id no se puede modificar'})};

    try{
        const product = await productsManager.update(productReq, pid);

        product ? res.send({status: 'sucess', message:'Producto Modificado'}) : res.send({status: 'error', message:`Producto no encontrado`})
    }catch(error){
        res.status(500).send({status: 'error'});
    }

    await manager.update(productReq, pid);
});

router.delete('/:pid', async (req,res)=> {
    const pid = Number(req.params.pid);

    try{
        const removedProduct = await productsManager.deleteById(pid)

        removedProduct ?  res.send({status: 'sucess', message:'Producto eliminado'}) : res.send({status: 'error', message: 'Producto no encontrado'})
    }catch(error){
        res.status(500).send({status: 'error', message:'errorifico'});
    }

    const removedProduct = await manager.deleteById(pid)
});

export default router;