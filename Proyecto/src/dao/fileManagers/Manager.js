import {promises} from 'fs'

export default class Manager {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async getAll() {
        try {
          const items = await promises.readFile(this.ruta, 'utf-8');
          return JSON.parse(items);
        } catch (error) {
          console.log(error);
          return [];
        }
    }

    async save(data) {
        const items = await this.getAll();
        if(items.length === 0){
            data.id = 1;
        } else{
            data.id =  items[items.length -1].id + 1;
        }
        items.push(data);

        const result = await promises.writeFile(this.ruta, JSON.stringify(items, null, '\t'));
        return result;
    }

    async getById(data) {
        const items = await this.getAll();
            
        const index=items.findIndex(e=>e.id===data); 
    
        if(index === -1) { 
            return items[index] = undefined;
        }
        return(items[index]);
    }

    async saveId(cid, pid){
        const carts = await this.getAll();
        const cart = await this.getById(cid);

        if(cart){
            const products = cart.products;
            const index=carts.findIndex(e=>e.id===cid)

            const indexProd = products.findIndex(prod => prod.product === pid)
            const prod = products.find(prod => prod.product === pid)

            if(indexProd > -1){
                carts[index].products[indexProd] = { ...prod, quantity: prod.quantity +1} 
            } else{ 
                carts[index].products.push({product:pid, quantity:1})
            }
            await promises.writeFile(this.ruta, JSON.stringify(carts, null, '\t')); 
            return "success";   
        } else {
            return "not found"
        }            
    }

    async update(data, id) {
        const items = await this.getAll();
        const item = await this.getById(id);
        const itemIndex=items.findIndex(e=>e.id===id);
        
        const newItem = { ...item, ...data }
        items[itemIndex] = newItem;

        await promises.writeFile(this.ruta, JSON.stringify(items, null, '\t'));
        return item;
    }

    async deleteById(id) {
        const items = await this.getAll();

        const indexItem = items.findIndex(p => p.id === id)
        
        const removedItem=[];
        if(indexItem!=-1){
            removedItem === items.splice(indexItem,1);

            await promises.writeFile(this.ruta, JSON.stringify(items, null, '\t'));
            return removedItem;    
        } else{
            return removedItem === undefined;
        }
    }

    // async deleteAll() {
    //     const products = await this.getAll();

    //     products.length = products.length - products.length;

    //     await promises.writeFile(path, JSON.stringify(products, null, '\t'));
    // }

}