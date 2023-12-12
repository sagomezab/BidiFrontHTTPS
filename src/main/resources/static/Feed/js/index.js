document.addEventListener('DOMContentLoaded', function () {
  const token = getTokenFromUrl();
  const decodedToken = decodeJWT(token);
  let givenName
  try{
    givenName = decodedToken.given_name;
  }catch(error){
    givenName = null;
  }
  if (givenName !== undefined && givenName !== null) {
    
    try {
      fetch(`http://localhost:8080/usuario/info/${givenName}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Usuario no encontrado');
          }
          
        })
        .then(usuario => {
        })
        .catch(error => {
          console.log('Usuario registrado');
          registrarNuevoUsuario(givenName);
        });
    } catch (error) {
      
    } 
    
    
    if (givenName) {
      
      localStorage.setItem('userName', givenName);

      var nombreUsuarioSpan = document.getElementById('NombreUuario');
      nombreUsuarioSpan.textContent = givenName;
      
    }
    
  }else {
    
    const sujeto = localStorage.getItem('userName'); 
    
    if(sujeto == null){
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '../Welcome/index.html';
    }else{
      
      var nombreUsuarioSpan = document.getElementById('NombreUuario');
      nombreUsuarioSpan.textContent = localStorage.getItem('userName');
    }
    
    
  }
  var crearProductoElement = document.getElementById('crearProducto');
  crearProductoElement.addEventListener('click', function () {
    document.querySelector('[data-bs-target="#Modal"]').click();
  });

  document.body.classList.add('loaded');
  const socket = new SockJS('http://localhost:8080/stompendpoint');
  const stompClient2 = Stomp.over(socket);
  const userName = localStorage.getItem('userName');
  var nombreUsuarioSpan = document.getElementById('NombreUuario');
  if (userName) {
    nombreUsuarioSpan.textContent = userName;
  }
  try {
    stompClient2.connect({}, function (frame) {
      console.log('Connected: ' + frame);

      stompClient2.subscribe('/topic/subasta/crear', function (message) {
        const subastaCreada = JSON.parse(message.body);
        cargarSubastas();

      });
    });
  } catch (error) {
    console.error('Error en el código:', error);
  }

  var botonCerrarSesion = document.getElementById('cerrar_sesion');
      botonCerrarSesion.addEventListener("click", function () {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../Welcome/index.html";
        localStorage.clear();
        sessionStorage.clear();
      });

});

function crearSubasta() {
  stompClient2.send('/app/subasta/crear', {}, JSON.stringify({
    //aquí metan la estructura del bicho ese 
  }));
}

function cargarSubastas() {
  fetch('http://localhost:8080/subasta')
    .then(response => response.json())
    .then(subastas => {

      const tabla = document.getElementById('subastasTable');
      const tbody = tabla.querySelector('tbody');


      tbody.innerHTML = '';


      subastas.forEach((subasta, index) => {
        const fila = `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${subasta.subastador.userName}</td>
            <td>${subasta.producto.nombre}</td>
            <td><img src="${subasta.producto.img}" alt="Imagen de la subasta" class = "imagen-lista"></td>
            <td><button type="button" class="button-table" onclick="unirseASubasta(${subasta.id})">unirse</button></td>
          </tr>
        `;
        tbody.innerHTML += fila;
      });
    })
    .catch(error => console.error('Error al obtener las subastas:', error));
}
function unirseASubasta(subastaId) {
  stompClient.send('/app/' + subastaId + '/' + userName + '/unirse', {});
  window.location.href = `../Subasta/index.html?id=${subastaId}`;
}

function cargarProductos() {
  fetch('http://localhost:8080/usuario/productos/todos')
    .then(response => response.json())
    .then(data => {
      const feedContainer = document.querySelector('.right_row .row.border-radius');

      for (const [nombreUsuario, productos] of Object.entries(data)) {
        if (productos.length > 0) {
          productos.forEach(producto => {
            const feedItem = createFeedItem(nombreUsuario, producto);
            feedContainer.appendChild(feedItem);
          });
        }
      }
    })
    .catch(error => console.error('Error al obtener los productos:', error));
}
function createFeedItem(nombreUsuario, producto) {
  const feedItem = document.createElement('div');
  feedItem.className = 'feed';

  const feedTitle = document.createElement('div');
  feedTitle.className = 'feed_title';
  feedTitle.innerHTML = `<span><b>${nombreUsuario}</b> shared a <a href="#">product</a><br><p>${getFormattedDate()}</p></span>`;

  const feedContent = document.createElement('div');
  feedContent.className = 'feed_content';
  feedContent.innerHTML = `<div class="feed_content_image">
    <img src="${producto.img}" alt="" />
  </div>`;

  const feedFooter = document.createElement('div');
  feedFooter.className = 'feed_footer';
  feedFooter.innerHTML = `<ul class="feed_footer_left">
    <li class="hover-orange selected-orange"><i class="fa fa-heart"></i> 0 likes</li>
    <li><span><b>Nobody</b> liked this</span></li>
  </ul>
  <ul class="feed_footer_right">
    <li class="hover-orange selected-orange"><i class="fa fa-share"></i> 0 shares</li>
    <li class="hover-orange"><i class="fa fa-comments-o"></i> 0 comments</li>
  </ul>`;

  feedItem.appendChild(feedTitle);
  feedItem.appendChild(feedContent);
  feedItem.appendChild(feedFooter);

  return feedItem;
}
function getFormattedDate() {
  const date = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function getTokenFromUrl() {
  const url = window.location.href;
  const tokenRegex = /#id_token=([^&]*)/;
  const match = url.match(tokenRegex);
  return match ? match[1] : null;
}


function registrarNuevoUsuario(givenName) {
  $.ajax({
    type: 'POST',
    url: `http://localhost:8080/usuario/registrar`,
    contentType: 'application/json',
    data: JSON.stringify({
      userName: givenName,
      
    }),
    success: function (response) {
      console.log('Usuario registrado exitosamente:', response);
    },
    error: function (error) {
      alert(error.responseJSON.mensaje);
    }
  });
}

function decodeJWT(token) {
  try{
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }catch(error){
    return null;
  }
  
}
cargarProductos();
cargarSubastas();
