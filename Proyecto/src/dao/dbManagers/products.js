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
        const product = await productsModel.findOne({id:pid});
        return product;
    }

    save = async(product) => {
        const products = await this.getAll();

        if(products.length === 0){
            product.id = 1;
        } else{
            product.id =  products[products.length -1].id + 1;
        }

        const result = await productsModel.create(product);
        return result;
    }

    update = async(data, id) => {
        const item = await this.getById(id);

        if(item){
            const updateItem = productsModel.updateOne({id: {$eq:id}}, {$set:data});  
            return updateItem;    
        } 
        
    }

    deleteById = async(id) => {
        const item = await this.getById(id);
        
        if(item){
            const removedItem = productsModel.deleteOne({id:id});  
            return removedItem;    
        } 
    }
}