import Carts from '../dao/dbManagers/carts.js' 

const cartsManager = new Carts();

export const saveCart = async () => {
    const result = await cartsManager.save();
    return result;
};

export const getCart = async(cid)=> {
    const result = await cartsManager.getById(cid);
    return result;
};

export const saveProductToCart = async (cid, pid) => {
    const result = await cartsManager.saveId(cid, pid);
    return result;
    // await manager.saveId(cid, pid);
};

export const deleteProductToCart = async (cid, pid) => {
    const result = await cartsManager.deleteId(cid, pid);
    return result;       
};

export const updateCart = async(cid, productsUpdate)=> {
    const result = await cartsManager.update(cid, productsUpdate);
    return result;
};

export const updateQuantityProductToCart = async (cid, pid, quantityUpdate) => {
    const result = await cartsManager.updateQuantity(cid, pid, quantityUpdate);
    return result;    
};

export const deleteAllProductsToCart = async (cid) => {
    const result = await cartsManager.deleteAll(cid);
    return result;
};

export const saveProductToCartSession = async (pid, req) => {
        let cart;
        if (!req.session.user.cart) {
            cart = await cartsManager.save();
            req.session.user.cart = cart._id;
        } else {
            cart = await cartsManager.getById(req.session.user.cart);
        }

        const cid = cart._id;
        const result = await cartsManager.saveId(cid, pid);
        req.session.user.cart = cart._id;
        return result;
};
