import * as cartsService from '../../services/carts.service.js';

const saveCart = async (req, res) => {
    try{
        const result = await cartsService.saveCart();
        res.send({status: 'sucess', message:'Carrito creado', payload: result});
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`Prueba error`);
    }
};

const getCart = async(req,res)=> {
    try{
        const cid = req.params.cid;
        // await manager.getById(cid)

        const result = await cartsService.getCart(cid);
        result ? res.sendSuccess(result) : res.sendClientError('Carrito no encontrado');
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.sendServerError(error);
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
};

const saveProductToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await cartsService.saveProductToCart(cid, pid);

        result ?  res.send({status: 'sucess', message:'Producto agregado al carrito'}) : res.send({status: 'error', message: 'Carrito no encontrado'})
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
    // await manager.saveId(cid, pid);
};

const deleteProductToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await cartsService.deleteProductToCart(cid, pid);
        
        result  
            ? result === "error" 
                ? res.send({status: 'error', message: 'Producto no encontrado dentro del carrito'})
                : res.send({status: 'sucess', message:'Producto eliminado del carrito'})
            : res.send({status: 'error', message: 'Carrito no encontrado'});        
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
};

const updateCart = async(req,res)=> {
    try{
        const productsUpdate = req.body;
        const cid = req.params.cid;
        
        const result = await cartsService.updateCart(cid, productsUpdate);

        result ? res.send({status: 'sucess', message:`Carrito modificado`}) : res.send({status: 'error', message:`Carrito no encontrado`})
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
};

const updateQuantityProductToCart = async (req, res) => {
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantityUpdate = req.body;

        const result = await cartsService.updateQuantityProductToCart(cid, pid, quantityUpdate);

        result  
            ? result === "error" 
                ? res.send({status: 'error', message: 'Producto no encontrado dentro del carrito'})
                : res.send({status: 'sucess', message:'Cantidad del producto modificado'})
            : res.send({status: 'error', message: 'Carrito no encontrado'});     
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
};

const deleteAllProductsToCart = async (req, res) => {
    try{
        const cid = req.params.cid;

        const result = await cartsService.deleteAllProductsToCart(cid);

        result ? res.send({status: 'sucess', message:`Productos eliminados del carrito`}) : res.send({status: 'error', message:`Carrito no encontrado`})
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch(error){
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
};

const saveProductToCartSession = async (req, res) => {
    try {
        const pid = req.params.id;
        const result = await cartsService.saveProductToCartSession(pid, req, res);
        res.send({status: 'sucess', result});
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    }
};

const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid;

        const result = await cartsService.purchaseCart(cid, req);
        res.send({status: 'sucess', result});
        req.logger.info(`Solicitud procesada: ${req.method} ${req.url}`);
    } catch (error) {
        console.log(error)
        res.status(500).send({error});
        req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
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