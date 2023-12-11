document.addEventListener('DOMContentLoaded', function () {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('main-container');
    // Botones para login grande
    const registrarButtonBigger = document.getElementById('registrar-Bigger');
    const ingresarButtonBigger = document.getElementById('ingresar-Bigger');

    //Botones para login chiquito
    const registrarButtonWrapper = document.getElementById('registrar-wrapper');
    const ingresarButtonWrapper = document.getElementById('ingresar-wrapper');

    signUpButton.addEventListener('click', function () {
        container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', function () {
        container.classList.remove('right-panel-active');
    });

    registrarButtonBigger.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form submission

        const nombre = document.getElementById('nombre-Bigger').value;
        const nombreUsuario = document.getElementById('nombreUsuarioRegistrar-Bigger').value;
        const correo = document.getElementById('correo-Bigger').value;
        const contraseña = document.getElementById('contraseñaRegistrar-Bigger').value;

        // Realizar una solicitud HTTP para registrar el usuario
        $.ajax({
            type: 'POST',
            url: 'http://20.127.253.105/usuario/registrar',
            contentType: 'application/json',
            data: JSON.stringify({
                userName: nombreUsuario,
                nombre: nombre,
                email: correo,
                password: contraseña
            }),
            success: function (response) {
                const userName = response.userName;
                localStorage.setItem('userName', userName);
                window.location.href = '../Feed/index.html';
            },
            error: function (error) {
                alert(error.responseJSON.mensaje);
            }
        });
    });

    ingresarButtonBigger.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form submission

        const nombreUsuarioLogin = document.getElementById('nombreUsuarioLogin-Bigger').value;
        const contraseñaLogin = document.getElementById('contraseñaLogin-Bigger').value;

        // Realizar una solicitud HTTP para iniciar sesión
        $.ajax({
            type: 'POST',
            url: 'http://20.127.253.105/usuario/login',
            contentType: 'application/json',
            data: JSON.stringify({
                userName: nombreUsuarioLogin,
                password: contraseñaLogin
            }),
            success: function (response) {
                localStorage.setItem('userName', nombreUsuarioLogin);
                window.location.href = '../Feed/index.html';
            },
            error: function (error) {
                alert(error.responseJSON.mensaje);
            }
        });
    });

    // Logica para login y register chiquito 

    registrarButtonWrapper.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form submission

        const nombre = document.getElementById('nombre-wrapper').value;
        const nombreUsuario = document.getElementById('nombreUsuarioRegistrar-wrapper').value;
        const correo = document.getElementById('correo-wrapper').value;
        const contraseña = document.getElementById('contraseñaRegistrar-wrapper').value;

        // Realizar una solicitud HTTP para registrar el usuario
        $.ajax({
            type: 'POST',
            url: 'http://20.127.253.105/usuario/registrar',
            contentType: 'application/json',
            data: JSON.stringify({
                userName: nombreUsuario,
                nombre: nombre,
                email: correo,
                password: contraseña
            }),
            success: function (response) {
                const userName = response.userName;
                localStorage.setItem('userName', userName);
                window.location.href = '../Feed/index.html';
            },
            error: function (error) {
                alert(error.responseJSON.mensaje);
            }
        });
    });

    ingresarButtonWrapper.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form submission

        const nombreUsuarioLogin = document.getElementById('nombreUsuarioLogin-wrapper').value;
        const contraseñaLogin = document.getElementById('contraseñaLogin-wrapper').value;

        // Realizar una solicitud HTTP para iniciar sesión
        $.ajax({
            type: 'POST',
            url: 'http://20.127.253.105/usuario/login',
            contentType: 'application/json',
            data: JSON.stringify({
                userName: nombreUsuarioLogin,
                password: contraseñaLogin
            }),
            success: function (response) {
                localStorage.setItem('userName', nombreUsuarioLogin);
                window.location.href = '../Feed/index.html';
            },
            error: function (error) {
                alert(error.responseJSON.mensaje);
            }
        });
    });

});