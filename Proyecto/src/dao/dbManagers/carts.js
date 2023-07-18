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
        const result = await cartsModel.create({});

        return result;
    }

    getById = async (cid) => {
        const cart = await cartsModel.findOne({_id:cid}).populate("products.product");
        if(cart === null) {return cart} else {return cart.toObject()};
    }

    saveId = async (cid, pid, quantityP) => {
        const cart = await this.getById(cid);

        const productos = cart.products;
        const indexProd = productos.findIndex(prod => prod.product._id == pid);

        if(indexProd > -1){
            const result = await cartsModel.updateOne({_id: {$eq: cid}, "products.product" : pid}, {$inc:{"products.$.quantity" : quantityP}});
            return result;
        } else{ 
            const result = await cartsModel.updateOne({_id: {$eq: cid}}, {$push:{products:{product:pid, quantity:quantityP}}});
            return result;
        }
    }  

    deleteId = async (cid, pid) => {
        // const products = cart.products;
        // const indexProd = products.findIndex(prod => prod.product._id == pid);

        // if(indexProd > -1){
        //     const result = await cartsModel.updateOne({ _id: cart_id }, { $pull: { products: { product: pid }}});
        //     return result;
        // } else{ 
        //     const result = "error";
        //     return result;
        // }

        const result = await cartsModel.updateOne({ _id: cid }, { $pull: { products: { product: pid }}});
        return result;
    }

    update = async (cid, productsUpdate) => {
        const cart = await this.getById(cid);

        if (!cart) return;

        const result = await cartsModel.updateOne({ _id: cid }, { products: productsUpdate});
        // req.logger.info('Actualización de base de datos CARTS realizada');
        return result;
    }

    updateQuantity = async (cid, pid, quantityUpdate) => {
        const cart = await this.getById(cid);

        if (!cart) return;

        const productos = cart.products;
        const indexProd = productos.findIndex(prod => prod.product._id == pid);

        if(indexProd > -1){
            const result = await cartsModel.updateOne({_id: {$eq: cid}, "products.product" : pid}, {$inc:{"products.$.quantity" : quantityUpdate.quantity}});
            // req.logger.info('Actualización de base de datos CARTS realizada');
            return result;
        } else{ 
            const result = "error";
            return result;
        }
    }

    deleteAll = async (cid) => {
        const cart = await this.getById(cid);

        if (!cart) return;

        const result = await cartsModel.updateOne({ _id: cid }, { products: []});
        // req.logger.info('Actualización de base de datos CARTS realizada');
        return result;
    }
}