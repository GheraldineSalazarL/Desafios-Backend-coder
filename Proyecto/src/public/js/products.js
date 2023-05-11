function addCart(id) {
    fetch(`http://localhost:8080/api/carts/cart/add/${id}`, {
      method: 'POST',
      body: JSON.stringify({ id: id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}





