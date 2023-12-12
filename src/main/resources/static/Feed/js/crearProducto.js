const userName = localStorage.getItem('userName');

function validarYCrearProducto() {
  var nombreProducto = document.getElementById("nombreProducto").value;
  var precioProducto = document.getElementById("precioProducto").value;
  var urlProducto = document.getElementById("urlProducto").value;

  if (nombreProducto !== "" && precioProducto !== "" && urlProducto !== "") {
      crearProducto();
  } else {
      alert("Completa todos los campos antes de crear el producto.");
  }
}

function crearProducto() {
  const nombre = document.getElementById('nombreProducto').value;
  const precio = parseInt(document.getElementById('precioProducto').value, 10) * 1000;
  const img = document.getElementById('urlProducto').value;

  const datosProducto = {
    nombre: nombre,
    precio: precio,
    img: img
  };

  fetch('http://localhost:8080/producto/create/' + userName, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosProducto)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error al enviar la petición para crear el producto:', error);
    });
}

