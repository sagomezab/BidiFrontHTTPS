// script.js

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    var enlace = document.getElementById('comenzar');

    if (enlace) {
        enlace.addEventListener('click', function(event) {
            event.preventDefault(); 
            window.location.href = '../Login/index.html';
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
