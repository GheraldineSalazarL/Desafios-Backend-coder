function changeUserRole(userId, isChecked) {

  fetch(`http://localhost:8080/api/users/premium/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ id: userId }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => {

    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Se ha cambiado el rol del usuario seleccionado.',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000
      });
      setTimeout(() => {
        location.reload();
      }, 3000);
    } else if (result.status === 400) {
      result.json().then(response => {
        let errorMessage = '';

        if (response.error === 'el usuario no ha terminado de procesar su documentación') {
          errorMessage = 'El usuario no ha terminado de procesar su documentación.';
        } else if (response.error === 'el rol ADMIN no puede cambiarse') {
          errorMessage = 'No puede cambiarse el rol de un Administrador.';
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
        setTimeout(() => {
          location.reload();
        }, 3000);
      });
    }
  });

}


function deleteUser(userId) {

  fetch(`http://localhost:8080/api/users/${userId}`, {
    method: 'DELETE',
    body: JSON.stringify({ id: userId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        location.reload();
      } else {
        throw new Error('Error en la solicitud POST');
      }
    })
}