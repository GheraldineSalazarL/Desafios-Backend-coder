import CartsRepository from '../repository/carts.repository.js';
import config from '../config/config.js';
import { ResultNotFound, RolForbiden } from '../utils/customExceptions.js';
import * as productsService from '../services/products.service.js';
import jwt from 'jsonwebtoken';
import * as sessionsService from '../services/sessions.service.js';
import Tickets from '../dao/dbManagers/purchase.js';
import uniqid from 'uniqid';
import { successfulPurchase } from '../utils/customHTML.js';
import { sendEmail } from './mail.service.js';

const PRIVATE_KEY = config.secret;

const cartsRepository = new CartsRepository();
const ticketsManager = new Tickets();

export const saveCart = async () => {
    const result = await cartsRepository.saveCart();
    return result;
};

export const getCart = async (cid) => {
    const result = await cartsRepository.getCart(cid);

    if(result===null){
        throw new ResultNotFound('cart not found');
    }
    return result;
};

export const saveProductToCart = async (cid, pid) => {
    const quantity  = 1;
    const result = await cartsRepository.saveProductToCart(cid, pid, quantity);
    return result;
};

export const deleteProductToCart = async (cid, pid) => {
    const cart = await cartsRepository.getCart(cid);
    if(cart===null){
        throw new ResultNotFound('cart not found');
    }
    const product = await productsService.getProduct(pid); 

    const productsCart = cart.products;
    const indexProd = productsCart.findIndex(prod => prod.product._id == pid);

    let result;
    if(indexProd > -1){
        result = await cartsRepository.deleteProductToCart(cid, pid);
    } else{ 
        throw new ResultNotFound('The product does not exist in the cart');
    }

    return result;
};

export const updateCart = async (cid, productsUpdate) => {
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
export const saveProductToCartSession = async (pid, token, quantity) => {
        const decodedToken = jwt.verify(token, PRIVATE_KEY);

        let cart;
        const user = await sessionsService.getByEmail(decodedToken.email)

        if (user.cart === '') {
            cart = await cartsRepository.saveCart();
            await sessionsService.updateCart(decodedToken.email, cart._id)
        } else {
            cart = await cartsRepository.getCart(user.cart);
        }

        const product = await productsService.getProduct(pid); 

        if(product.owner === decodedToken.email){
            throw new RolForbiden('the owner cannot add his own products to the cartd');
        }

        const cid = cart._id;

        const cartDB = await cartsRepository.getCart(cid);
        if(cartDB===null){
            throw new ResultNotFound('cart not found');
        }

        const result = await cartsRepository.saveProductToCart(cid, pid, quantity);

        return result;
};

export const purchaseCart = async (cart, user) => {
        const productsPurchase = [];
        const ProductsCanceled = [];

        for (const item of cart.products) {
            const product = await productsService.getProduct(item.product);
      
            if (product.stock >= item.quantity) {
                const price = product.price;
                productsPurchase.push({...item, price});
                product.stock -= item.quantity;
                await productsService.updateProduct({"stock": product.stock}, product._id);
            } else {
                ProductsCanceled.push(item)
            }
        }

        let total = 0;
        for (const product of productsPurchase) {
            const subtotal = product.price * product.quantity; 
            total += subtotal;
        }

        await cartsRepository.updateCart(cart._id, ProductsCanceled);
        
        const code = uniqid();
        const purchaseDatetime = new Date();
        
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

    const productsPurchasedTitle = productsPurchase.map(item => item.product.title);
    const productsUnpurchasedTitle = ProductsCanceled.map(item => item.product.title);

    const email = {
        to: user.email,
        subject:  'Compra Exitosa', 
        html: successfulPurchase(productsPurchasedTitle, total, productsUnpurchasedTitle)
    }
    await sendEmail(email);

    return ticketResult;
};
