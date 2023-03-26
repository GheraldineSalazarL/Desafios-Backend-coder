import mongoose from 'mongoose';

const cartsCollections = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                } ,
                quantity: Number
            }
        ],
        default: [],
    }
});

// cartsSchema.pre('find', function(){
//     this.populate('products.product');
// }) 

export const cartsModel = mongoose.model(cartsCollections, cartsSchema);