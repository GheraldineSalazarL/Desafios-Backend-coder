// import Carts from '../dao/dbManagers/carts.js' 
import CartsRepository from '../repository/carts.repository.js';
import { transporter } from '../utils.js';
import config from '../config/config.js'; 

const EMAILTO = config.emailTo;

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

    const productsPurchased = result.productsPurchased.map(item => item.product.title);
    const productsUnpurchased = result.productsUnpurchased.map(item => item.product.title);

    await transporter.sendMail({
        from: 'Compra Realizada <compras@compras.com>',
        to: `${EMAILTO}`,
        subject: 'Tu compra ha sido realizada',
        html: `<div> <h1> Compra exitosa </h1>  
                    <p>Productos comprados: ${productsPurchased}</p>
                    <p>TOTAL: ${result.total}</p>
                    <p></p>
                    <p>Productos que no compraste por falta de stock: ${productsUnpurchased}</p>
                    <p></p>
                    <h4>Gracias por tu compra</h4>
                </div>`
    });

    return result;
};
