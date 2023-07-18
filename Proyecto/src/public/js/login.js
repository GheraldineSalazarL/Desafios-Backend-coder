const form = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/products');
        } else if (result.status === 400) {
            result.json().then(response => {
                let errorMessage = '';

                if (response.error === 'User not found') {
                    errorMessage = 'Usuario no encontrado.';
                    form.reset();
                } else if (response.error === 'Incorrect credentials') {
                    errorMessage = 'Contraseña incorrecta.';
                    passwordInput.value = '';
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