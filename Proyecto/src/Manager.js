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
            return data;
    }

    async getById(data) {
        const items = await this.getAll();
            
        const index=items.findIndex(e=>e.id===data); 
    
        if(index === -1) { 
            return items[index] = undefined;
        }
        return(items[index]);
    }

    async saveId(cid, prod, pid){
        
        const cart = await manager.getById(cid);

        if(!cart){
            return "not found";
        }

        const products = cart.products;

        const indexP=products.findIndex(p=>p.product===pid); 

        if(indexP === -1) { 
            const product = {
                "product": pid,
                "quantity": prod.quantity
            }
            products.push(product);
            await promises.writeFile(this.ruta, JSON.stringify(products, null, '\t'));
            return "product";
            
        }else {
            const newProduct = {
                ...products[indexP],
                "quantity": products[indexP].quantity + prod.quantity
            }
            products[indexP] = newProduct;
            await promises.writeFile(this.ruta, JSON.stringify(products[indexP], null, '\t'));
            return "newProduct";
        };
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