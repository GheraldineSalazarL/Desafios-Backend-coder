import fs from 'fs';

const path = './files/Productos.json'

export default class ProductManager{
    getProducts = async() =>{
        try {
            if(fs.existsSync(path)){
                const data= await fs.promises.readFile(path, 'utf-8');
                console.log(data);
                const products = JSON.parse(data);
                return products;
            }else{
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (product) => {
        const products = await this.getProducts();
        if(products.length === 0){
            product.id = 1;
        } else{
            product.id =  products[product.length-1].id+1;
        }
        products.push(product);

        await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
        return product;
    }

    getProductById = async(productId) =>{
        const products = await this.getProducts();
        const productFound = products.find(product => product.id = productId);
        
        if(productFound===-1){
            return "El producto no existe"
        }
        return productFound;
    }

    updateProduct = async(productId, fieldTitle, fieldDescription, fieldPrice, fieldThumbnail, fieldCode, fieldStock) => {
        const productFound = await this.getProductById();
        const products = await this.getProducts();

        const updatedProduct = products.map(prod =>
            prod.id === productId
              ? { ...prod, 
                    title: fieldTitle,
                    description: fieldDescription,
                    price: fieldPrice,
                    thumbnail: fieldThumbnail,
                    code: fieldCode, 
                    stock: fieldStock}
              : prod
          );

        await fs.promises.writeFile(path, JSON.stringify(updatedProduct, null, '\t'));
        return updatedProduct; 

    }

    deleteProduct = async(productId) => {
        const products = await this.getProducts();
        const removedProduct =  products.slice(productId.index)

        await fs.promises.writeFile(path, JSON.stringify(removedProduct, null, '\t'));
        return removedProduct;
    }
    
}