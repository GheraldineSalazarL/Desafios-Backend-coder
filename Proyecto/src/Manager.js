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
    
            await promises.writeFile(this.ruta, JSON.stringify(items, null, '\t'));
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

    async deleteById(id) {
        const products = await this.getAll();
        const product = await this.getById(id);

        if (!product) {
            return Error("Not found");
        }


        const removedProduct =  products.splice(id-1,1)

        await promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return removedProduct;    
    }

    async deleteAll() {
        const products = await this.getAll();

        products.length = products.length - products.length;

        await promises.writeFile(path, JSON.stringify(products, null, '\t'));
    }

    async update(id, field, value) {
        const products = await this.getAll();

        if(field==="id") { return "error" };

        const updatedProduct = 
            products.map(prod =>
                prod.id === id
                ? { ...prod, 
                        [field]: value,
                        }
                : prod
            );  

        await promises.writeFile(path, JSON.stringify(updatedProduct, null, '\t'));
    }

}