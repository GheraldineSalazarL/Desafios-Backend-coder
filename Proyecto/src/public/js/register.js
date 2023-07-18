const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Usuario creado exitosamente, puede iniciar sesión',
                position: 'top-end',
                toast: true,
                showConfirmButton: false,
                timer: 5000
            });

            window.location.replace('/login');
        } else if (result.status === 400) {
            result.json().then(response => {
                let errorMessage = '';

                if (response.error === 'incomplete values') {
                    errorMessage = 'Ingrese todos los campos solicitados.';
                } else if (response.error === 'User already exists') {
                    errorMessage = 'El usuario con el email ingresado ya existe.';
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