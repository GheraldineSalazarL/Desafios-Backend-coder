import { Router } from 'express'

const router = Router();

const products = [];

router.get('/', (req, res) => {
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

router.get('/:pid', (req,res)=> {
    const pid = Number(req.params.pid);
    
    const productIndex=products.findIndex(e=>e.id===pid); 
    if(productIndex === -1) { 
        res.send({status: 'error', message:`Producto no encontrado`})
        return;
    }
    res.send(products[productIndex]);
})

router.post('/', (req, res) => {
    const product = req.body

    if(products.length === 0){
        product.id = 1;
    } else{
        product.id =  products[products.length -1].id + 1;
    }

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

    products.push(product);

    res.send({status: 'sucess', message:'Producto creado'});
});

router.put('/:pid', (req,res)=> {
    const productReq = req.body;
    const pid = Number(req.params.pid);

    const productIndex=products.findIndex(e=>e.id===pid);

    let product = products[productIndex];

    if(productReq.id) {return res.send({status: 'error', message:'el id no se puede modificar'});}

    const newProduct = { ...product, ...productReq }

    if(product){
        products[productIndex] = newProduct;
        res.send({status: 'sucess', message:'Producto actualizado'});
    } else{
        res.send({status: 'error', message: 'Producto no encontrado'});
    }
});

router.delete('/:pid', (req,res)=> {
    const pid = Number(req.params.pid);

    const index = products.findIndex(p => p.id === pid)

    if(index!=-1){
        products.splice(index,1);
        res.send({status: 'sucess', message:'Producto eliminado'});
    } else{
        res.send({status: 'error', message: 'Producto no encontrado'});
    }
});

export default router;