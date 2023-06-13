import Products from '../dao/dbManagers/products.js';
import { ResultNotFound } from '../utils/customExceptions.js';

const productsManager = new Products();

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
        status: 'success',
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

export const getProduct = async(pid)=> {
    // const product = await manager.getById(pid);
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

export const updateProduct = async (productReq, pid)=> {
    const result = await productsManager.update(productReq, pid);

    return result;

    // await manager.update(productReq, pid);
};

export const deleteProduct =  async (pid)=> {
    const result = await productsManager.deleteById(pid)

    return result;

    // const removedProduct = await manager.deleteById(pid)
};