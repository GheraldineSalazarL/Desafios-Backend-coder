import ProductManager from "./manager/ProductManager.js";

const manager = new ProductManager();

const ProductManager = async() => {
    let productos = await manager.getProducts();
    console.log(productos);

    const product = {
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc123", 
        stock: 25
    };

    await manager.addProduct(product);
    productos = await manager.getProducts();
    console.log(productos);
}

ProductManager();