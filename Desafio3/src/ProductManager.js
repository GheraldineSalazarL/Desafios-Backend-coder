import { promises } from 'fs';

export default class ProductManager {

  constructor(ruta) {
    this.ruta = ruta;
  }

  async save(product) {
    const products = await this.getAll();
        if(products.length === 0){
            product.id = 1;
        } else{
            product.id =  products[products.length -1].id + 1;
        }
        products.push(product);

        await promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return product;
  }

  async getById(id) {
    const products = await this.getAll();
        
    const productIndex=products.findIndex(e=>e.id===id); 

    if(productIndex === -1) { 
        console.log("Notfound");
        return;
    }

    return(products[productIndex]);
  }

  async getAll() {
    try {
      const products = await promises.readFile(this.ruta, 'utf-8');
      return JSON.parse(products);
    } catch (error) {
      console.log(error);
      return [];
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