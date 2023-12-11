document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('userName');
    
    if (userName) {
        // Muestra un mensaje de bienvenida personalizado
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.innerHTML = `Bienvenido, ${userName}!`;
    } else {
        console.log('Nombre del usuario no encontrado en localStorage.');
    }
});