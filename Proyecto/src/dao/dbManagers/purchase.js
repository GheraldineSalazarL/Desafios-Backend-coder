import { ticketsModel } from '../models/ticket.js';

export default class Tickets {

    constructor(){
        console.log('Working Carts with DB in mongoDb');
    }

    save = async(ticket) => {
        const result = await ticketsModel.create(ticket);
        return result;
    }
}