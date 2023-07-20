import * as cartsService from '../../services/carts.service.js';
import * as productService from '../../services/products.service.js'; 
import { ResultNotFound, RolForbiden } from '../../utils/customExceptions.js';

const saveCart = async (req, res) => {
    try{
        const result = await cartsService.saveCart();
        res.sendSuccess({message:'Carrito creado', payload: result});
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.sendServerError(error);
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
    }
};

const getCart = async(req,res)=> {
    try{
        const cid = req.params.cid;

        const result = await cartsService.getCart(cid);

        res.sendSuccess(result)
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);
    }
};

const saveProductToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;

        await cartsService.getCart(cid);
        await productService.getProduct(pid);

        const result = await cartsService.saveProductToCart(cid, pid);

        res.sendSuccess('Producto agregado al carrito')
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);
    }
};

const deleteProductToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await cartsService.deleteProductToCart(cid, pid);

        res.sendSuccess('Producto eliminado del carrito')
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message); 
        }
        res.sendServerError(error);
    }
};

const updateCart = async(req,res)=> {
    try{
        const productsUpdate = req.body;
        const cid = req.params.cid;

        await cartsService.getCart(cid);
        await productService.getProduct(productsUpdate[0].product);
        
        const result = await cartsService.updateCart(cid, productsUpdate);

        res.sendSuccess('Carrito modificadoo')
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message); 
        }
        res.sendServerError(error);
    }
};

const updateQuantityProductToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantityUpdate = req.body;

        await cartsService.getCart(cid);
        await productService.getProduct(pid);

        const result = await cartsService.updateQuantityProductToCart(cid, pid, quantityUpdate);

        res.sendSuccess('Cantidad del producto modificado')
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if (error instanceof ResultNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);   
    }
};

const deleteAllProductsToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        
        await cartsService.getCart(cid);

        const result = await cartsService.deleteAllProductsToCart(cid);

        res.sendSuccess('Productos eliminados del carrito')
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if (error instanceof ResultNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);   
    }
};

const saveProductToCartSession = async (req, res) => {
    try {
        const pid = req.params.id;
        const quantityProduct = req.body.quantityProduct;
        const token = req.cookies.token;

        let quantity;
        if(quantityProduct){ quantity = quantityProduct} else { quantity = 1 }

        const result = await cartsService.saveProductToCartSession(pid, token, quantity);
        res.sendSuccess('Producto agregado al carrito');
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);

        if(error instanceof ResultNotFound){
            return res.sendClientError(error.message); 
        }
        if(error instanceof RolForbiden){
            return res.sendForbbidenError(error.message); 
        }

        res.sendServerError(error);
    }
};

const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        
        const cart = await cartsService.getCart(cid);   
        
        const user = req.user;
        
        const result = await cartsService.purchaseCart(cart, user);
        res.sendSuccess({result})
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
        if (error instanceof ResultNotFound) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error);   
    }
};


export {
    saveCart,
    getCart,
    saveProductToCart,
    deleteProductToCart,
    updateCart,
    updateQuantityProductToCart,
    deleteAllProductsToCart,
    saveProductToCartSession,
    purchaseCart
}