const userName = localStorage.getItem('userName');
let stompClient; 

document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
    const socket = new SockJS('http://20.127.253.105/stompendpoint');
    stompClient = Stomp.over(socket);

    try {
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            stompClient.subscribe('/topic/subasta/crear', function(message) {
                const subastaCreada = JSON.parse(message.body);
                cargarSubastas();
            });

        });

    } catch (error) {
        console.error('Error en el código:', error);
    }
});

function cargarProductos() {
    fetch('http://20.127.253.105/usuario/productos/' + userName)
        .then(response => response.json())
        .then(productos => {
            console.log('Productos obtenidos:', productos);
            crearTarjetas(productos);
        })
        .catch(error => console.error('Error al obtener los productos:', error));
}

function seleccionarProducto(id, nombre, precio, img) {
    Swal.fire({
        text: `¿Estás seguro de que deseas subastar el producto "${nombre}"?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const usuarioPromise = fetch('http://20.127.253.105/usuario/info/' + userName)
                .then(response => response.json())
                .catch(error => {
                    console.error('Error al obtener información del usuario:', error);
                    throw error;
                });

            Promise.all([usuarioPromise])
                .then(([usuario]) => {
                    const productoSeleccionado = {
                        id: id,
                        nombre: nombre,
                        precio: precio,
                        img: img
                    };
                    const subastaData = {
                        subastador: usuario,
                        producto: productoSeleccionado,
                        precioInicial: precio,
                        estado: true,
                        cantidadDeOfertantes: 0,
                        oferentes: [],
                        precioFinal: null,
                        ganador: null,
                        messageList: [],
                    };

                    // Realizar el envío de la subasta
                    stompClient.send('/app/subasta/crear', {}, JSON.stringify(subastaData));

                    // Después de enviar la subasta, redirigir
                    window.location.href = "../Feed/index.html";
                })
                .catch(error => {
                    console.error('Error al obtener información del usuario:', error);
                });
        } else {
            console.log("Operación cancelada");
        }
    });
}


function crearTarjetas(productos) {
    var container = document.getElementById('albumContainer');

    productos.forEach(producto => {
        var cardHtml = `
            <div class="col-md-4 d-inline-block">
                <div class="card mb-4 shadow-sm">
                    <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: $${producto.precio.toFixed(2)}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="seleccionarProducto(${producto.id},'${producto.nombre}',${producto.precio},'${producto.img}')">Seleccionar</button>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

cargarProductos();
