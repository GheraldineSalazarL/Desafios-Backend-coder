import CustomError from '../../services/errors/CustomError.js';
import EErrors from '../../services/errors/enum.js';
import { generateProductErrorInfo } from '../../services/errors/info.js';
import * as productsService from '../../services/products.service.js'; 

const getProductsPaginate = async (req, res) => {  
    try{
        const { limit = 10, page = 1, sort, category, stock} = req.query;

        const result = await productsService.getProductsPaginate(limit, page, sort, category, stock);

        res.send({status: 'success', result});
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }

};

const getProduct = async(req,res)=> {
    try {
        const pid = req.params.pid;

        const result = await productsService.getProduct(pid);
        
        result ? res.send({ status: 'success', result }) : res.status(400).send({status: 'error', message:`Producto no encontrado`})
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        res.status(500).send({ status:"error", message: error});  
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
    
};

const saveProduct = async (req, res) => {
    try{
        const { title,description,code,price,status,stock,category,thumbnails,id } = req.body;    

        if(!title || !description || !code || !price || !stock || !category){
            // return res.status(400).send({status: 'error', message:'Valores incompletos'});
            throw CustomError.createError({
                name: 'UserError',
                cause: generateProductErrorInfo({
                    title,
                    description,
                    code,
                    price,
                    stock, 
                    category
                }),
                message: 'Error tratando de crear un producto',
                code: EErrors.INVALID_TYPES_ERROR
            });
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
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
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
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    }catch(error){
        res.status(500).send({status: 'error'});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
    // await manager.update(productReq, pid);
};

const deleteProduct =  async (req,res)=> {
    try{
        const pid = req.params.pid;

        const result = await productsService.deleteProduct(pid)

        result ?  res.send({status: 'sucess', message:'Producto eliminado'}) : res.send({status: 'error', message: 'Producto no encontrado'})
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    }catch(error){
        res.status(500).send({status: 'error'});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
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