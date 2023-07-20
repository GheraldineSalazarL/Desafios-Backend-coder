import Products from '../dao/dbManagers/products.js';
import { ResultNotFound, RolForbiden } from '../utils/customExceptions.js';
import { sendEmail } from './mail.service.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { productDeleteNotification, productUpdateNotification } from '../utils/customHTML.js';

const productsManager = new Products();
const PRIVATE_KEY = config.secret;

export const getProductsPaginate = async (limit, page, sort, category, stock) => {  
    let query = {};
    if(category) query = {category : `${category}`};
    if(stock) query = {stock : `${stock}`};
    if(category && stock) query = {$and: [ {category : `${category}`},{stock : `${stock}`} ]}  

    const result = await productsManager.getAllPage(limit, page, sort, query);

    const products = result.docs; 
    result.prevLink = result.hasPrevPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${result.prevPage}`
        : null;
    result.nextLink = result.hasNextPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${result.nextPage}`
        : null;

    const res={
        payload: products, 
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink
    }
    return res;
};

export const getAllProducts = async()=> {
    const result = await productsManager.getAll();
    if(result===null){
        throw new ResultNotFound('products not found');
    }
    return result;
};

export const getProduct = async(pid)=> {
    const result = await productsManager.getById(pid);
    if(result===null){
        throw new ResultNotFound('product not found');
    }
    return result;
};

export const saveProduct = async (product) => {    
        const result = await productsManager.save(product);

        return result;
};

export const updateProduct = async (productReq, pid, token, product)=> {
    const decodedToken = jwt.verify(token, PRIVATE_KEY);

    if(decodedToken.rol === 'ADMIN' || (decodedToken.rol === 'PREMIUM' && decodedToken.email === product.owner)) {
        const result = await productsManager.update(productReq, pid);

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(decodedToken.rol === 'ADMIN' && regex.test(product.owner)){
            const email = {
                to: product.owner,
                subject:  'Producto Modificado', 
                html: productUpdateNotification
            }
            await sendEmail(email);
        }

        return result;
    } else {
        throw new RolForbiden('User does not owner of product');
    }
};

export const deleteProduct =  async (pid, token, product)=> {

    const decodedToken = jwt.verify(token, PRIVATE_KEY);

    if(decodedToken.rol === 'ADMIN' || (decodedToken.rol === 'PREMIUM' && decodedToken.email === product.owner)) {
        const result = await productsManager.deleteById(pid)

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(decodedToken.rol === 'ADMIN' && regex.test(product.owner)){
            const email = {
                to: product.owner,
                subject:  'Producto eliminado', 
                html: productDeleteNotification
            }
            await sendEmail(email);
        }

        return result;
    } else {
        throw new RolForbiden('User does not owner of product');
    }

};