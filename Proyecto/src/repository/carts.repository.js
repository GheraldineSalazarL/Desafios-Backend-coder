import Carts from '../dao/dbManagers/carts.js';

const cartsManager = new Carts();

export default class CartsRepository {
    constructor(){
        // this.dao = dao;
    };

    saveCart = async () => {
        const result = await cartsManager.save();
        return result;
    };
    
    getCart = async(cid)=> {
        const result = await cartsManager.getById(cid);
        return result;
    };
    
    saveProductToCart = async (cid, pid, quantity) => {
        const result = await cartsManager.saveId(cid, pid, quantity);
        return result;
    };
    
    deleteProductToCart = async (cid, pid) => {
        const result = await cartsManager.deleteId(cid, pid);
        return result;       
    };
    
    updateCart = async(cid, productsUpdate)=> {
        const result = await cartsManager.update(cid, productsUpdate);
        return result;
    };
    
    updateQuantityProductToCart = async (cid, pid, quantityUpdate) => {
        const result = await cartsManager.updateQuantity(cid, pid, quantityUpdate);
        return result;    
    };
    
    deleteAllProductsToCart = async (cid) => {
        const result = await cartsManager.deleteAll(cid);
        return result;
    };
}