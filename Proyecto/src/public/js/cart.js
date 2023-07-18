function deleteClick(productId) {
    const cidElement = document.getElementById('cid-data');
    const cartId = cidElement.getAttribute('data-cid');

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(result => {
        if (result.status === 200) {
            location.reload();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error.',
                position: 'top-end',
                toast: true,
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function buy(cid) {
    fetch(`/api/carts/${cid}/purchase`, {
        method: 'POST',
       body: JSON.stringify({cid}),
       headers: {
        'Content-Type': 'application/json'
       } 
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                icon: 'success',
                title: '¡Compra exitosa!',
                text: 'La compra se ha realizado con éxito.',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = '/products'; 
                }
              });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error, vuelva a intentarlo.',
                position: 'top-end',
                toast: true,
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

