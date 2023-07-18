const passwordInput = document.getElementById('passwordInput');

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  window.location.href = '/login';
}

passwordInput.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(passwordInput);
  formData.append('userToken', token);

  const data = Object.fromEntries(formData.entries());

  fetch('/api/sessions/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Contraseña cambiada con éxito',
        text: 'Tu contraseña ha sido actualizada exitosamente.',
        timer: 5000,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      setTimeout(() => {
        window.location.replace('/login'); 
      }, 5000);
    } else if (result.status === 400) {
      result.json().then(response => {
        let errorMessage = '';

        if (response.error === 'Password incomplete') { 
          errorMessage = 'Ingrese la contraseña.';
        } else if (response.error === 'Token is invalid or has expired') {
          errorMessage = 'El tiempo de restablecimiento de contraseña ha expirado.';
          setTimeout(() => {
            window.location.replace('/login'); 
          }, 5000);
        } else if (response.error === 'User not found') {
          errorMessage = 'Usuario no encontrado';
          setTimeout(() => {
            window.location.replace('/login'); 
          }, 5000);
        } else if (response.error === 'Token expired, new token generated and sent by email') {
          errorMessage = 'El tiempo de restablecimiento ha expirado, se ha enviado un nuevo email de restablecimiento.';
          setTimeout(() => {
            window.location.replace('/login'); 
          }, 5000);          
        } else if (response.error === 'Cant enter the same password as before') {
          errorMessage = 'No puede ingresar la misma contraseña anterior, intente con una nueva.';
          passwordInput.reset();
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
          timer: 4000
        });
      });
    }
  });
});
