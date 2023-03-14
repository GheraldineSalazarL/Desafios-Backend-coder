import { chatModel } from '../models/messages.js'

export default class Chat {

    constructor(){
        console.log('Working Products with DB in mongoDb');
    }

    save = async(message) => {
        const result = await chatModel.create(message);
        return result;
    }
    
}