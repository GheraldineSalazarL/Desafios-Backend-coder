// import Carts from '../dao/dbManagers/carts.js' 
import CartsRepository from '../repository/carts.repository.js';

// const cartsManager = new Carts();
const cartsRepository = new CartsRepository();

export const saveCart = async () => {
    const result = await cartsRepository.saveCart();
    return result;
};

export const getCart = async(cid)=> {
    const result = await cartsRepository.getCart(cid);
    return result;
};

export const saveProductToCart = async (cid, pid) => {
    const result = await cartsRepository.saveProductToCart(cid, pid);
    return result;
    // await manager.saveId(cid, pid);
};

export const deleteProductToCart = async (cid, pid) => {
    const result = await cartsRepository.deleteProductToCart(cid, pid);
    return result;       
};

export const updateCart = async(cid, productsUpdate)=> {
    const result = await cartsRepository.updateCart(cid, productsUpdate);
    return result;
};

export const updateQuantityProductToCart = async (cid, pid, quantityUpdate) => {
    const result = await cartsRepository.updateQuantityProductToCart(cid, pid, quantityUpdate);
    return result;    
};

export const deleteAllProductsToCart = async (cid) => {
    const result = await cartsRepository.deleteAllProductsToCart(cid);
    return result;
};

export const saveProductToCartSession = async (pid, req, res) => {
        const result = await cartsRepository.saveProductToCartSession(pid, req, res);
        return result;
};

export const purchaseCart = async (cid, req) => {
    const result = await cartsRepository.purchaseCart(cid, req);
    return result;
};
