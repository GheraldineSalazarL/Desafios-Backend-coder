import { cartsModel } from '../models/carts.js'

export default class Carts {

    constructor(){
        console.log('Working Carts with DB in mongoDb');
    }

    getAll = async () => {
        const carts = await cartsModel.find();
        return carts.map(cart => cart.toObject());
    }

    save = async(cart) => {
        const carts = await this.getAll();

        if(carts.length === 0){
            cart.id = 1;
        } else{
            cart.id =  carts[carts.length -1].id + 1;
        }

        const result = await cartsModel.create(cart);
        return result;
    }

    getById = async (cid) => {
        const cart = await cartsModel.findOne({id:cid});
        return cart;
    }

    saveId = async (cid, pid) => {
        const cart = await this.getById(cid);

        if (!cart) return;

        const productos = cart.products;
        const indexProd = productos.findIndex(prod => prod.product === pid);

        if(indexProd > -1){
            const result = await cartsModel.updateOne({id: {$eq: cid}, "products.product" : pid}, {$inc:{"products.$.quantity" : 1}});
            return result;
        } else{ 
            const result = await cartsModel.updateOne({id: {$eq: cid}}, {$push:{products:{product:pid, quantity:1}}});
            return result;
        }
      
    }  
}