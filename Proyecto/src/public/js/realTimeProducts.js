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

const userDataRolElement = document.getElementById('userRol-data');
const userRol = userDataRolElement.getAttribute('data-userRol');

const userDataEmailElement = document.getElementById('userEmail-data');
const userEmail = userDataEmailElement.getAttribute('data-userEmail');

const imagePlaceholder = 'https://via.placeholder.com/600x400';


socket.on('products', data => {
    let products;
    if(userRol === 'PREMIUM') {products = data.filter(prod => prod.owner === userEmail)} else { products = data }; 
    productsContainer.innerHTML = `
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Imagen</th>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Código</th>
                                                <th>Precio</th>
                                                <th>Stock</th>
                                                <th>Categoría</th>
                                                <th>ID</th>
                                                <th>Owner</th>
                                                <th>Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${products.map(prod => `
                                                <tr>
                                                    <td><img class="product-thumbnail" src="${prod.thumbnails || imagePlaceholder}" /></td>
                                                    <td class="product-name">${prod.title}</td>
                                                    <td class="product-description">${prod.description}</td>
                                                    <td>${prod.code}</td>
                                                    <td>${prod.price}</td>
                                                    <td>${prod.stock}</td>
                                                    <td>${prod.category}</td>
                                                    <td class="product-id">${prod._id}</td>
                                                    <td>${prod.owner}</td>
                                                    <td><button class="btn-delete" onClick="deleteClick('${prod._id}')"><i class="fa-solid fa-trash"></i></button></td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                `;
});

socket.on('newProductAdded', () => {

    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Producto agregado exitosamente.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
    });
});

deleteClick = (id) =>{
    socket.emit('spliced', id)
}


button.onclick = (e) =>{
    e.preventDefault()

    if (!title.value || !description.value || !code.value || !price.value || !stock.value || !category.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa los campos antes de crear el nuevo producto, el único campo vacío puede ser la foto.',
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 5000
        });
    }

    let owner;
    if(userRol === 'PREMIUM') {owner = userEmail} else {owner = 'ADMIN'}
    const newProduct = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        status: true,
        stock: stock.value,
        category: category.value,
        thumbnails: [],
        owner:  owner
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


