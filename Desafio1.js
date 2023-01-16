class ProductManager{
    constructor(){ 
        this.productos = [];
    }

    getProducts = () => {
        return this.productos;
    }

    getProductById = (idProducto) => {
        const productoIndex=this.productos.findIndex(e=>e.id===idProducto); 

        if(productoIndex === -1) { //si no existe pondrá -1
            console.log("Notfound");
            return;
        }

        console.log(this.productos[productoIndex]);
    }

    addProduct = (title, descripcion, price, thumbnail, code, stock) => {
        const producto={
            title,
            descripcion,
            price,
            thumbnail,
            code,
            stock
        }

        if(this.productos.length==0){
            producto.id=1;
        }else{
            producto.id=this.productos[this.productos.length-1].id+1; 
        }

        const productoCode = this.productos.find(e=>e.code==code);
        if(productoCode){
            console.log("Codigo del producto repedito ");
            return;
        }

        const isEmpy = Object.values(producto).some(e=>e==="")
        if(isEmpy){
            console.log("Todos los campos son obligatorios");
            return;
        }
        
        this.productos.push(producto);
    }  
}


//-----------------------------------------TESTING----------------------------------------
const manejadorProductos = new ProductManager();

//No se a agregado productos = Arreglo vacio
console.log(manejadorProductos.getProducts());

//Se agrega un producto y se agrega id automáticamente
manejadorProductos.addProduct("producto prueba", "este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(manejadorProductos.getProducts());

//Se agrega un producto con código repetido al anterior = Error
manejadorProductos.addProduct("producto prueba", "este es un producto prueba", 200, "Sin imagen", "abc123", 25);

//Se agrega un segundo producto, se comprueba que el id aumenta para no repetirse
manejadorProductos.addProduct("producto prueba2", "este es un producto prueba2", 200, "Sin imagen", "abc234", 25);
console.log(manejadorProductos.getProducts());

//Se agrega un producto con un valor vacio = no se agrega a productos y genera error
manejadorProductos.addProduct("", "este es un producto prueba2", 200, "Sin imagen", "abc223", 25);

//Se busca un producto por su Id 
manejadorProductos.getProductById(5);