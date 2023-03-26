import { Router } from 'express'
// import Manager from '../../dao/fileManagers/Manager.js';
import __dirname from '../../utils.js';
import Products from '../../dao/dbManagers/products.js';

const router = Router();

const productsManager = new Products();

// const manager = new Manager(`${__dirname}/files/productos.json`);

router.get('/', async (req, res) => {  
    const { limit = 10, page = 1, sort, category, stock} = req.query;

    let query = {};
    if(category) query = {category : `${category}`};
    if(stock) query = {stock : `${stock}`};
    if(category && stock) query = {$and: [ {category : `${category}`},{stock : `${stock}`} ]}  

    try{
        const result = await productsManager.getAllPage(limit, page, sort, query)

        const products = result.docs; 
        result.prevLink = result.hasPrevPage
            ? `http://localhost:8080/api/products?limit=${limit}&page=${result.prevPage}`
            : null;
        result.nextLink = result.hasNextPage
            ? `http://localhost:8080/api/products?limit=${limit}&page=${result.nextPage}`
            : null;

        res.send({
            status: 'success',
            payload: products, 
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink
        });
    } catch(error){
        res.status(500).send({error});
    }

});

router.get('/:pid', async(req,res)=> {
    const pid = req.params.pid;

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

    // const product = req.body;
    // if(!product.status) {product.status = true};
    // if(!product.thumbnails) {product.thumbnails = []}

    // await manager.save(product);
});

router.put('/:pid', async (req,res)=> {
    const productReq = req.body;
    const pid = req.params.pid;

    // if(productReq.id) {return res.send({status: 'error', message:'el id no se puede modificar'})};

    try{
        const product = await productsManager.update(productReq, pid);

        product ? res.send({status: 'sucess', message:'Producto Modificado'}) : res.send({status: 'error', message:`Producto no encontrado`})
    }catch(error){
        res.status(500).send({status: 'error'});
    }

    // await manager.update(productReq, pid);
});

router.delete('/:pid', async (req,res)=> {
    const pid = req.params.pid;

    try{
        const removedProduct = await productsManager.deleteById(pid)

        removedProduct ?  res.send({status: 'sucess', message:'Producto eliminado'}) : res.send({status: 'error', message: 'Producto no encontrado'})
    }catch(error){
        res.status(500).send({status: 'error'});
    }

    // const removedProduct = await manager.deleteById(pid)
});

export default router;