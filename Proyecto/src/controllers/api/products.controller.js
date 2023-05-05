import * as productsService from '../../services/products.service.js'; 

const getProductsPaginate = async (req, res) => {  
    try{
        const { limit = 10, page = 1, sort, category, stock} = req.query;

        const result = await productsService.getProductsPaginate(limit, page, sort, category, stock);

        res.send({status: 'success', result});
    } catch(error){
        res.status(500).send({error});
    }

};

const getProduct = async(req,res)=> {
    try {
        const pid = req.params.pid;

        const result = await productsService.getProduct(pid);
        
        result ? res.send({ status: 'success', result }) : res.status(400).send({status: 'error', message:`Producto no encontrado`})
    } catch (error) {
        res.status(500).send({ status:"error", message: error});  
    }
    
};

const saveProduct = async (req, res) => {
    try{
        const { title,description,code,price,status,stock,category,thumbnails,id } = req.body;    

        if(!title || !description || !code || !price || !stock || !category){
            return res.status(400).send({status: 'error', message:'Valores incompletos'});
        } 

        const product = {
            title,
            description,
            code,
            price,
            status,
            stock, 
            category,
            thumbnails,
            id
        };
        
        const result = await productsService.saveProduct(product);

        res.send({ result: 'success', result});
    }catch(error){
        res.status(500).send({error});
    }

    // const product = req.body;
    // if(!product.status) {product.status = true};
    // if(!product.thumbnails) {product.thumbnails = []}

    // await manager.save(product);
};

const updateProduct = async (req,res)=> {
    try{
        const productReq = req.body;
        const pid = req.params.pid;

        const result = await productsService.updateProduct(productReq, pid);

        result ? res.send({status: 'sucess', message:'Producto Modificado'}) : res.send({status: 'error', message:`Producto no encontrado`})
    }catch(error){
        res.status(500).send({status: 'error'});
    }
    // await manager.update(productReq, pid);
};

const deleteProduct =  async (req,res)=> {
    try{
        const pid = req.params.pid;

        const result = await productsService.deleteProduct(pid)

        result ?  res.send({status: 'sucess', message:'Producto eliminado'}) : res.send({status: 'error', message: 'Producto no encontrado'})
    }catch(error){
        res.status(500).send({status: 'error'});
    }

    // const removedProduct = await manager.deleteById(pid)
};

export {
    getProductsPaginate, 
    getProduct, 
    saveProduct, 
    updateProduct, 
    deleteProduct
}