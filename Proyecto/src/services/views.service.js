import Products from '../dao/dbManagers/products.js'
import Carts from '../dao/dbManagers/carts.js';
import Users from '../dao/dbManagers/users.js'

const productsManager = new Products();
const cartsManager = new Carts();
const usersManager = new Users();

export const getAllProducts = async () => {
    const result = await productsManager.getAll(); 
    return result;
};

export const getProductsPaginate = async (limit, page, sort, category, stock) => {
    let query = {};
    if(category) query = {category : `${category}`};
    if(stock) query = {stock : `${stock}`};
    if(category && stock) query = {$and: [ {category : `${category}`},{stock : `${stock}`} ]}  

    const result = await productsManager.getAllPage(limit, page, sort, query)

    return result;
};

export const getCart = async (cid) => {
    const result = await cartsManager.getById(cid);
    return result;
};

export const getUsers = async () =>{
    const user = await usersManager.getUsers()
    if(!user){
        throw new ResultNotFound('User not found');
    }
    return user;
}

