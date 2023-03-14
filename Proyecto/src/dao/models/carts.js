import mongoose from 'mongoose';

const cartsCollections = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    }
});

export const cartsModel = mongoose.model(cartsCollections, cartsSchema)