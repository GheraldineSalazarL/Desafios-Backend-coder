import { productsModel } from '../models/products.js'

export default class Products {

    constructor(){
        console.log('Working Products with DB in mongoDb');
    }

    getAll = async (limit) => {
        if(limit){
            const products = await productsModel.find().limit(limit)   ;
            return products.map(product => product.toObject());
        } else {
            const products = await productsModel.find();
            return products.map(product => product.toObject());
        }
    }

    getAllPage = async (limit, page, sort, query) => {

        if(sort){
            const result = await productsModel.paginate(query, { limit, page, sort:{price: sort},  lean: true})
            return result;
        } else {
            const result = await productsModel.paginate(query, { limit, page,  lean: true})
            return result;
        }
        
    }

    getById = async (pid) => {
        const product = await productsModel.findOne({_id:pid});
        if(product === null) {return product} else {return product.toObject()};
    }

    save = async(product) => {
        const result = await productsModel.create(product);
        return result;
    }

    update = async(productReq, pid) => {
        const updateItem = productsModel.updateOne({_id: {$eq:pid}}, {$set:productReq});  
        return updateItem;         
    }

    deleteById = async(pid) => {
        const removedItem = productsModel.deleteOne({_id:pid});  
        return removedItem; 
    }
}