import { generateProduct } from "../utils.js";

export const getProducts = async () => {
    let products = []; 
    
    for(let i= 0; i<100; i++){
        products.push(generateProduct()) 
    }

    return products;
};