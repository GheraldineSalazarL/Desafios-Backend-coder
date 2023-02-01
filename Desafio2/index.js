import ProductManager from "./Manager/ProductManager.js";

const manager = new ProductManager();

const productManager = async() => {

    //Testing: Metodo getProduct - consultar los productos
    let productos = await manager.getProducts();
    // console.log(productos);



    //Testing: Metodo addProduct - crear un nuevo producto, id unico incremental
    // const product = {
    //     title: "Producto5",
    //     description: "Este es un producto prueba",
    //     price: 200,
    //     thumbnail: "sin imagen",
    //     code: "abc123", 
    //     stock: 25
    // };
    // await manager.addProduct(product);
    // productos = await manager.getProducts();
    // console.log(productos);



    //Testing: Metodo getProductById - Consulta un solo producto por id
    // productos = await manager.getProductById(3);
    // console.log(productos);



    //Testing: Metodo updateProduct - actualiza un campo de producto por id
    // productos = await manager.updateProduct(2, "title", "Producto_Modificado2");
    // console.log(productos);



    //Testing: Metodo deleteProduct - elimina un producto por id
    productos = await manager.deleteProduct(1);
    // console.log(productos);
}

productManager();