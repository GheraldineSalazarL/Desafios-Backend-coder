const emailInput = document.getElementById('emailInput');

emailInput.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(emailInput);
  const obj = {};

  data.forEach((value, key) => obj[key] = value);

  fetch('/api/sessions/forgot-password', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => {
    if (result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Email enviado con éxito',
        text: 'Se ha enviado a tu email un link de restablecimieento de contraseña.',
        timer: 7000,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      setTimeout(() => {
        window.location.replace('/login');
      }, 3000);
    } else if (result.status === 400) {
      result.json().then(response => {
        let errorMessage = '';

        if (response.error === 'Email incomplete') {
          errorMessage = 'Ingrese el email.';
        } else if (response.error === 'User not found') {
          errorMessage = 'Usuario no encontrado.';
          emailInput.value = '';
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
});
