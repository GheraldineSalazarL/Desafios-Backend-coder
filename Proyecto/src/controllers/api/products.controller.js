import CustomError from '../../services/errors/CustomError.js';
import EErrors from '../../services/errors/enum.js';
import { generateProductErrorInfo } from '../../services/errors/info.js';
import * as productsService from '../../services/products.service.js'; 
import { ResultNotFound } from '../../utils/customExceptions.js';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
import { RolForbiden } from '../../utils/customExceptions.js';

const PRIVATE_KEY = config.secret;

const getProductsPaginate = async (req, res) => {  
    try{
        const { limit = 10, page = 1, sort, category, stock} = req.query;

        const result = await productsService.getProductsPaginate(limit, page, sort, category, stock);

        res.send({status: 'success', result});
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
    }

};

const getProduct = async(req,res)=> {
    try {
        const pid = req.params.pid;

        const result = await productsService.getProduct(pid);
        // result ? res.send({ status: 'success', result }) : res.status(400).send({status: 'error', message:`Producto no encontrado`})
        res.sendSuccess(result);
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if(error instanceof ResultNotFound){
            res.sendClientError('Producto no encontrado')
        }
        res.sendServerError(error);
    }
    
};

const saveProduct = async (req, res) => {
    try{
        const { title,description,code,price,status,stock,category,thumbnails,id, owner } = req.body;    

        if(!title || !description || !code || !price || !stock || !category){
            // return res.status(400).send({status: 'error', message:'Valores incompletos'});
            throw CustomError.createError({
                name: 'ProductError',
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

        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, PRIVATE_KEY);

        const product = {
            title,
            description,
            code,
            price,
            status,
            stock, 
            category,
            thumbnails,
            id,
            owner: decodedToken.rol==="PREMIUM" ? decodedToken.email : "ADMIN"
        };
        
        const result = await productsService.saveProduct(product);

        res.send({ result: 'success', result});
    }catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
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

        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, PRIVATE_KEY);

        const product = await productsService.getProduct(pid);


        if(decodedToken.rol === 'ADMIN') {
            const result = await productsService.updateProduct(productReq, pid);

            req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
            return res.send({status: 'sucess', message:'Producto Modificado'});
        } 

        if(decodedToken.rol === 'PREMIUM' && decodedToken.email === product.owner) {
            const result = await productsService.updateProduct(productReq, pid);
            
            req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
            return res.send({status: 'sucess', message:'Producto Modificado'});
        } else {
            throw new RolForbiden('User does not owner of product');
        }
        
    }catch(error){
        if(error instanceof ResultNotFound){
            res.sendClientError('Carrito no encontrado')
        }
        if(error instanceof RolForbiden){
            res.sendClientError('User does not owner of product')
        }
        res.status(500).send({status: 'error'});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
    }
    // await manager.update(productReq, pid);
};

const deleteProduct =  async (req,res)=> {
    try{
        const pid = req.params.pid;

        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, PRIVATE_KEY);

        const product = await productsService.getProduct(pid);


        if(decodedToken.rol === 'ADMIN') {
            const result = await productsService.deleteProduct(pid)

            req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
            return res.send({status: 'sucess', message:'Producto Eliminado'});
        } 

        if(decodedToken.rol === 'PREMIUM' && decodedToken.email === product.owner) {
            const result = await productsService.deleteProduct(pid)

            req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
            return res.send({status: 'sucess', message:'Producto Eliminado'});
        } else {
            throw new RolForbiden('User does not owner of product');
        }

    }catch(error){
        if(error instanceof ResultNotFound){
            res.sendClientError('Carrito no encontrado')
        }
        if(error instanceof RolForbiden){
            res.sendClientError('User does not owner of product')
        }
        res.status(500).send({status: 'error'});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
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