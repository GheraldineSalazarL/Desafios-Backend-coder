import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollections = 'products';

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        default: []
    },
    // id: {
    //     type: Number,
    //     required: true
    // }
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollections, productsSchema)