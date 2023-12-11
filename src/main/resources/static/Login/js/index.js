document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    const signUpButton = document.querySelector('#signUp');
    const signInButton = document.querySelector('#signIn');
    const container = document.querySelector('#main-container');
    const wrapper = document.querySelector(".wrapper");
    const signupHeader = document.querySelector(".signup header");
    const loginHeader = document.querySelector(".login header");

    signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
    signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

    loginHeader.addEventListener("click", () => {
        wrapper.classList.add("active");
    });

    signupHeader.addEventListener("click", () => {
        wrapper.classList.remove("active");
    });

    window.addEventListener('resize', function() {
        // Obtén el ancho de la pantalla actual
        var windowWidth = window.innerWidth;

        // Selecciona las secciones
        var biggerSection = document.getElementById('Bigger');
        var wrapperSection = document.querySelector('.wrapper');

        // Aplica la lógica según el ancho de la pantalla
        if (windowWidth <= 600) {
            biggerSection.style.display = 'none';
            wrapperSection.style.display = 'block';
        } else {
            biggerSection.style.display = 'block';
            wrapperSection.style.display = 'none';
        }
    });

    // Dispara el evento resize después de que el DOM esté cargado completamente
    window.dispatchEvent(new Event('resize'));
});
