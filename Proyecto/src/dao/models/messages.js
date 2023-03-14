import mongoose from 'mongoose';

const chatCollections = 'messages';

const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ""
    }
});

export const chatModel = mongoose.model(chatCollections, chatSchema)