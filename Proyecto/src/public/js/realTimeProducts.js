const socket = io();

const title = document.getElementById('title');
const description = document.getElementById('description');
const code = document.getElementById('code');
const price = document.getElementById('price');
const stock = document.getElementById('stock');
const category = document.getElementById('category');
const thumbnails = document.getElementById('thumbnails');
const button = document.getElementById('button');

const productsContainer = document.getElementById('products-container');
const imagePlaceholder = 'https://via.placeholder.com/600x400';

socket.on('products', data => {
    
    productsContainer.innerHTML= ``
    data.forEach(prod =>{
        productsContainer.innerHTML += `<div class="product-container">
                                    <h2>Nombre: ${prod.title}</h2>
                                    <div class="img-info-product">
                                        <img src=${prod.thumbnails || imagePlaceholder} />
                                        <div class="info-product">
                                            <p>Descipción: ${prod.description}</p>
                                            <p>Código: ${prod.code}</p>
                                            <p>Precio: ${prod.price}</p>
                                            <p>Stock: ${prod.stock}</p>
                                            <p>Categoría: ${prod.category}</p>
                                            <p>Id: ${prod.id}</p>
                                            <button class="btn-delete" onClick="deleteClick(${prod.id})"><i class="fa-solid fa-trash")></i></button>
                                        </div>
                                    </div>
                                </div>`;
    })
});

deleteClick = (id) =>{
    socket.emit('spliced', id)
}

button.onclick = (e) =>{
    e.preventDefault()
    const newProduct = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        status: true,
        stock: stock.value,
        category: category.value,
        thumbnails: []
    }
    
    socket.emit('newProduct', newProduct);
    
    resetInputs();
};

const resetInputs = () =>{
    title.value = "";
    description.value = "";
    code.value = "";
    price.value = "";
    stock.value = "";
    category.value = "";
    thumbnails.value = "";
}


