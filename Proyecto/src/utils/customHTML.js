export const loginNotification = `<!DOCTYPE html>
    <html>
    <head>
        <title>Notificación de inicio de sesión exitoso</title>
        <style>
            .container {
                width: 300px;
                padding: 20px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 5px;
                text-align: center;
                margin: 0 auto;
                margin-top: 50px;
            }

            .success {
                color: #008000;
                font-size: 18px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="success">Inicio de sesión exitoso</h2>
            <p>Bienvenido/a a nuestro sitio web.</p>
        </div>
    </body>
    </html>`


export const registerNotification = `<!DOCTYPE html>
<html>
<head>
    <title>Notificación de registro exitoso</title>
    <style>
        .container {
            width: 300px;
            padding: 20px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
            margin: 0 auto;
            margin-top: 50px;
        }

        .success {
            color: #008000;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="success">Registro exitoso</h2>
        <p>Bienvenido/a a nuestro sitio web.</p>
    </div>
</body>
</html>`

export const generatePasswordResetEmailHTML = (userHash) => {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Recuperación de Contraseña</title>
    <style>
        .container {
            width: 300px;
            padding: 20px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
            margin: 0 auto;
            margin-top: 50px;
        }

        .success {
            color: #008000;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="success">Recuperación de contraseña</h2>
        <p>Para recuperar la contraseña haga click en el enlace</p>
        <a href="http://localhost:8080/resetPassword?token=${userHash}"> <button> Recuperar Contraseña </button> </a>
    </div>
</body>
</html>` }

export const DeleteUserNotification = `<!DOCTYPE html>
<html>
<head>
    <title>Notificación de Usuario Eliminado</title>
    <style>
        .container {
            width: 300px;
            padding: 20px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
            margin: 0 auto;
            margin-top: 50px;
        }

        .success {
            color: #008000;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="success">Usuario eliminado</h2>
        <p>Su usuario ha sido eliminado por inactividad</p>
    </div>
</body>
</html>`


export const productDeleteNotification = `<!DOCTYPE html>
<html>
<head>
    <title>Notificación de Producto Eliminado</title>
    <style>
        .container {
            width: 300px;
            padding: 20px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
            margin: 0 auto;
            margin-top: 50px;
        }

        .success {
            color: #008000;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="success">Producto eliminado</h2>
        <p>Un producto de un usuario Premium ha sido eliminado por un Administrador</p>
    </div>
</body>
</html>`

export const successfulPurchase = (productsPurchased, total, productsUnpurchased) => {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Compra Exitosa</title>
    <style>
        .container {
            width: 300px;
            padding: 20px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
            margin: 0 auto;
            margin-top: 50px;
        }

        .success {
            color: #008000;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="success">Productos comprados:</h2>
        <p>${productsPurchased}</p>
        <p>TOTAL: ${total}</p>
        <hr>
        <h2 class="success">Productos que no compraste por falta de stock:</h2>
        <p>${productsUnpurchased}</p>
        <p></p>
        <h4>Gracias por tu compra</h4>
    </div>
</body>
</html>`}