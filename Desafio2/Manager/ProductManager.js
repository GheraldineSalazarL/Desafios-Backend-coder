import fs from 'fs';

const path = './files/Productos.json'

export default class ProductManager{
    getProducts = async() => {
        try {
            if (fs.existsSync(path)) {
                const data = await fs.promises.readFile(path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            }else{
                return [];
            }
        }  catch (error) {
            console.log(error);
        }
    }

    addProduct = async(product) => {
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1;
        } else{
            product.id =  products[products.length -1].id + 1;
        }
        products.push(product);

        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return product;
    }

    getProductById = async(productId) =>{
        const products = await this.getProducts();
        
        const productIndex=products.findIndex(e=>e.id===productId); 

        if(productIndex === -1) { 
            console.log("Notfound");
            return;
        }

        return(products[productIndex]);
    }

    updateProduct = async(id, field, value) => {
        const products = await this.getProducts();

        if(field==="id"){
            return "error"
        }

        const updatedProduct = products.map(prod =>
            prod.id === id
              ? { ...prod, 
                    [field]: value,
                    }
              : prod
        );             

        await fs.promises.writeFile(path, JSON.stringify(updatedProduct, null, '\t'));
        return updatedProduct; 

    }

    deleteProduct = async(productId) => {
        const products = await this.getProducts();
        const product = await this.getProductById(productId);

        if (!product) {
            return Error("Not found");
          }

        const removedProduct =  products.splice(productId-1,1)
        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return removedProduct;
        
    }
    
}