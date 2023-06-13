import Carts from '../dao/dbManagers/carts.js';
import Products from '../dao/dbManagers/products.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { generateToken } from '../utils.js';
import Tickets from '../dao/dbManagers/purchase.js';
import uniqid from 'uniqid';
import { ResultNotFound } from '../utils/customExceptions.js';

const PRIVATE_KEY = config.secret;

const cartsManager = new Carts();
const productsManager = new Products();
const ticketsManager = new Tickets();

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
        if(result===null){
            throw new ResultNotFound('cart not found');
        }
        return result;
    };
    
    saveProductToCart = async (cid, pid) => {
        const result = await cartsManager.saveId(cid, pid);
        return result;
        // await manager.saveId(cid, pid);
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
    
    // saveProductToCartSession = async (pid, req, res) => {
    //         const token = req.cookies.token;
    //         const decodedToken = jwt.verify(token, PRIVATE_KEY);
            
    //         let cart;
    //         if (decodedToken.cart.length === 0) {
    //             cart = await cartsManager.save();
    //             decodedToken.cart = cart._id;
    //             const updatedToken = generateToken(decodedToken);
    //             res.cookie('token', updatedToken, { httpOnly: true })
    //         } else {
    //             cart = await cartsManager.getById(decodedToken.cart);
    //         }

    //         // const product = await productsManager.getById(pid); 
    
    //         const cid = cart._id;
    //         const result = await cartsManager.saveId(cid, pid);

    //         return result;
    // };

    purchaseCart = async (cid, req) => {
        const cart = await cartsManager.getById(cid);
        if(!cart) return "cart not found";

        const productsPurchase = [];
        const ProductsCanceled = [];

        for (const item of cart.products) {
            const product = await productsManager.getById(item.product);

            if (!product) {
                return `Product ${item._id} not found`;
            }
      
            if (product.stock >= item.quantity) {
                const price = product.price;
                productsPurchase.push({...item, price});
                product.stock -= item.quantity;
                await productsManager.update({"stock": product.stock}, product._id);
            } else {
                ProductsCanceled.push(item)
            }
        }

        let total = 0;
        for (const product of productsPurchase) {
            const subtotal = product.price * product.quantity;
          
            total += subtotal;
        }

        await cartsManager.update(cid, ProductsCanceled);
        
        const code = uniqid();
        const purchaseDatetime = new Date();
        // const token = req.cookies.token;
        // const decodedToken = jwt.verify(token, PRIVATE_KEY);
        const user = req.user;
        console.log(user)
        const ticket = {
            code: code,
            date: purchaseDatetime,
            amount: total, 
            purchaser: user.email
        }
        await ticketsManager.save(ticket);

        const ticketResult = {
            productsPurchased: productsPurchase,
            total: total,
            productsUnpurchased: ProductsCanceled,
        }

        return ticketResult;
};
}