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

        res.sendSuccess({ result });
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        res.sendServerError(error);
    }

};

const getProduct = async(req,res)=> {
    try {
        const pid = req.params.pid;

        const result = await productsService.getProduct(pid);
        res.sendSuccess(result);
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);
    }
    
};

const saveProduct = async (req, res) => {
    try{
        const { title,description,code,price,status,stock,category,thumbnails,id, owner } = req.body;    

        if(!title || !description || !code || !price || !stock || !category){
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

        res.sendSuccess(result);
    }catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        res.sendServerError(error);
    }
};

const updateProduct = async (req,res)=> {
    try{
        const productReq = req.body;
        const pid = req.params.pid;

        const token = req.cookies.token;

        const product = await productsService.getProduct(pid);

        const result = await productsService.updateProduct(productReq, pid, token, product);

        res.sendSuccess('Producto modificado');
    }catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message);
        }
        if(error instanceof RolForbiden){
            return res.sendClientError(error.message);
        }
        res.status(500).send({status: 'error'});
    }
};

const deleteProduct =  async (req,res)=> {
    try{
        const pid = req.params.pid;
        const token = req.cookies.token;

        const product = await productsService.getProduct(pid);

        const result = await productsService.deleteProduct(pid, token, product)

        res.sendSuccess(`Producto Eliminado`);  
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    }catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message);
        }
        if(error instanceof RolForbiden){
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);
    }
};

export {
    getProductsPaginate, 
    getProduct, 
    saveProduct, 
    updateProduct, 
    deleteProduct
}