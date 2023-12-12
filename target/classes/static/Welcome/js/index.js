// script.js

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    var enlace = document.getElementById('comenzar');

    if (enlace) {
        enlace.addEventListener('click', function(event) {
            event.preventDefault(); 
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'https://finalBidifyB2C.b2clogin.com/finalBidifyB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_LoginLogout&client_id=6b65410c-c4ac-420e-8471-970eaee2d63e&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fbidifronthttps.azurewebsites.net%2FFeed%2Findex.html&scope=openid&response_type=id_token&prompt=login';
            localStorage.clear();
            sessionStorage.clear();
        });
    } else {
        console.error('No se encontró el elemento con ID "comenzar".');
    } 
    /* Slide cada 5 segundos*/
    var slideContainer = document.getElementById('slide-container');
    // Inicializa el índice del slide actual
    var currentSlide = 1;
    // Función para cambiar al siguiente slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide > 3) {
            currentSlide = 1;
        }
        // Selecciona el input radio correspondiente al siguiente slide
        document.getElementById('slide-' + currentSlide).checked = true;
    }

    // Establece el intervalo para cambiar automáticamente cada 5 segundos
    var intervalId = setInterval(nextSlide, 5000);

    // Detén el intervalo al hacer clic en un control de slide
    document.querySelectorAll('.slide-control').forEach(function(control) {
        control.addEventListener('click', function() {
            clearInterval(intervalId);
        });
    });
});
