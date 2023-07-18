function addCart(id) {
  const quantityProduct = document.getElementById(id).value;

  fetch(`http://localhost:8080/api/carts/cart/add/${id}`, {
    method: 'POST',
    body: JSON.stringify({id: id, quantityProduct: quantityProduct}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Producto agregado al carrito',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000 
      });
    } else if (result.status === 403) {
      result.json().then(response => {
        let errorMessage = '';

        if (response.error === 'Forbidden') {
          errorMessage = 'Un Administrador no puede agregar un producto a un carrito';
        } else if (response.error === 'the owner cannot add his own products to the cartd') {
          errorMessage = 'No puedes agregar al carrito tu propio producto';
        } else {
          errorMessage = 'Ha ocurrido un error.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  });
};


document.getElementById('categoryFilter').addEventListener('change', updateFilters);
document.getElementById('sortFilter').addEventListener('change', updateFilters);
document.getElementById('stockFilter').addEventListener('change', updateFilters);

function updateFilters() {
  const page = 1;
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;
  const stock = document.getElementById('stockFilter').value;
  console.log(stock)

  const urlParams = new URLSearchParams(window.location.search);

  urlParams.set('page', page);
  urlParams.set('category', category);
  urlParams.set('sort', sort);
  urlParams.set('stock', stock);

  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

  window.location.href = newUrl;
}

const urlParams = new URLSearchParams(window.location.search);
document.getElementById('categoryFilter').value = urlParams.get('category') || '';
document.getElementById('sortFilter').value = urlParams.get('sort') || '';
document.getElementById('stockFilter').value = urlParams.get('stock') || '';


function updatePageUrl(page) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', page);
  window.location.href = url.href;
}
