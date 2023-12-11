let stompClient;

document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('loaded');

  const subastaId = obtenerSubastaIdDesdeUrl();
  const socket = new SockJS('http://20.127.253.105/stompendpoint');
  stompClient = Stomp.over(socket);
  const userName = localStorage.getItem('userName');
  let chatHabilitado = false;
  let isSubastador = false;
  let precioActual;
  mostrarMensajesEnInterfaz();

  try {
    stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);

      stompClient.subscribe('/topic/subasta/' + subastaId + '/actualizacion', function (message) {
        const subastaActualizada = JSON.parse(message.body);
        actualizarInterfazConSubasta();
      });

      stompClient.subscribe('/topic/subasta/' + subastaId + '/' + userName + '/unirse', function (message) {
        const subastaCreada = JSON.parse(message.body);
        fetch(`http://20.127.253.105/subasta/${subastaId}`)
        .then(response => response.json())
        .then(subasta => {
          const participantsTableBody = document.getElementById('participantsTableBody');
          participantsTableBody.innerHTML = '';
          subasta.oferentes.forEach(participant => {
            participantsTableBody.innerHTML += `<tr class="align-center" ><td>${participant.nombre}</td></tr>`;
          });
        })
      .catch(error => console.error('Error al obtener la subasta:', error));
        
      });

      stompClient.subscribe('/topic/subasta/' + subastaId + '/messages', function (message) {
        try {
          const response = JSON.parse(message.body);
          mostrarMensajesEnInterfaz();
          actualizarInterfazConSubasta();
          precioActual = response.precioFinal;
        } catch (error) {
          console.error('Error al analizar el mensaje JSON:', error);
        }
      });
      stompClient.subscribe('/topic/subasta/' + subastaId + '/obtener', function (message) {
        const subasta = JSON.parse(message.body);
        var ganadorElement = document.getElementById("ganador");
        var montoElement = document.getElementById("monto");
        ganadorElement.textContent = subasta.ganador.userName;
        montoElement.textContent = formatNumber(subasta.precioFinal);

      });
      stompClient.subscribe('/topic/subasta/' + subastaId + '/finalizar', function (message) {
        const subastaFinalizada = JSON.parse(message.body);
        actualizarInterfazConSubasta();
        actualizarEstadoChat(false);
      });

      stompClient.subscribe('/topic/subasta/' + subastaId + '/iniciar', function (message) {
        const subastaIniciada = JSON.parse(message.body);
        precioActual = subastaIniciada.precioFinal;
        actualizarEstadoChat(true);
      });
    });
    fetch(`http://20.127.253.105/subasta/${subastaId}`)
      .then(response => response.json())
      .then(subasta => {
        actualizarInterfazConSubasta();
        isSubastador = subasta.subastador.userName === userName;
        precioActual = subasta.precioFinal;
        const finalizarButton = document.getElementById('finalizarButton');

        const messageForm = document.getElementById('messageForm');
        const iniciarButton = document.getElementById('iniciarButton');
        if (subasta.estado == false) {
          messageForm.style.display = 'none';
          finalizarButton.style.display = 'none';
        } else {
          iniciarButton.style.display = 'none';
        }
        if (isSubastador) {
          messageForm.style.display = 'none';
        } else {
          iniciarButton.style.display = 'none';
          finalizarButton.style.display = 'none';

        }
      })
      .catch(error => console.error('Error al obtener la subasta:', error));

  } catch (error) {
    console.error('Error en el código:', error);
  }


  const msgerForm = document.getElementById("messageForm");
  const msgerInput = document.getElementById("messageInput");
  const msgerChat = document.querySelector(".msger-chat");
  const finalizar = document.getElementById('finalizarButton');
  const iniciar = document.getElementById('iniciarButton');
  var valorOriginalDisplay = finalizarButton.style.display;
  var ValorOriginalChat = msgerForm.style.display;
  msgerInput.addEventListener("input", function (event) {
    let inputValue = event.target.value.trim();
    inputValue = inputValue.replace(/[^\d]/g, '');
    const formattedNumber = formatNumber(parseInt(inputValue));
    msgerInput.value = formattedNumber;
  });

  msgerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const msgText = msgerInput.value.trim();
    const bidAmount = parseInt(msgText.replace(/[^\d]/g, ''));
    if (bidAmount >= precioActual) {
      stompClient.send('/app/' + subastaId + '/messages', {}, JSON.stringify({
        senderEmail: userName,
        replymessage: parseInt(msgText.replace(/[^\d]/g, ''))
      }));

      msgerInput.value = '';

    } else {
      alert("Solo se pueden ofertar valores mayores a la oferta actual");
    }


  });
  finalizar.addEventListener('click', function (event) {
    finalizarSubasta();
  });
  iniciar.addEventListener('click', function (event) {
    iniciarSubasta();
  });

  function finalizarSubasta() {
    const subastaId = obtenerSubastaIdDesdeUrl();
    finalizarButton.disabled = true;
    finalizarButton.style.display = 'none';
    stompClient.send('/app/' + subastaId + '/finalizar', {});

  }

  function iniciarSubasta() {
    const subastaId = obtenerSubastaIdDesdeUrl();
    iniciarButton.disabled = true;
    iniciarButton.style.display = 'none';
    finalizarButton.style.display = valorOriginalDisplay;
    stompClient.send('/app/' + subastaId + '/iniciar', {});

  }
  function formatNumber(number) {
    return '$' + (isNaN(number) ? '0' : new Intl.NumberFormat('es-ES').format(number));
  }
  function actualizarEstadoChat(estado) {
    chatHabilitado = estado;
    const messageForm = document.getElementById('messageForm');
    messageForm.style.display = chatHabilitado && !isSubastador ? ValorOriginalChat : 'none';

  }
  function mostrarMensajesEnInterfaz() {
    const msgerChat = document.querySelector(".msger-chat");
    msgerChat.innerHTML = '';

    fetch(`http://20.127.253.105/subasta/${subastaId}/messages`)
      .then(response => response.json())
      .then(messages => {
        messages.forEach(msg => {
          const side = msg.senderEmail === userName ? 'right' : 'left';
          appendMessage(side, msg.senderEmail, msg.replymessage);
        });
      })
      .catch(error => console.error('Error al obtener mensajes:', error));
  }

  function appendMessage(side, name, text) {
    const formattedNumber = formatNumber(parseInt(text));
    const msgHTML = `
        <div class="msg ${side}-msg">
          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">${name}</div>
              <div class="msg-info-time">${formatDate(new Date())}</div>
            </div>
            <div class="msg-text">Yo ofrezco: ${formattedNumber}</div>
          </div>
        </div>
      `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop = msgerChat.scrollHeight;
  }

  function obtenerSubastaIdDesdeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const subastaId = urlParams.get('id');

    if (subastaId && !isNaN(subastaId)) {
      return parseInt(subastaId);
    } else {
      console.error("No se pudo obtener el ID de la subasta desde la URL.");
      return null;
    }
  }

  function actualizarInterfazConSubasta() {
    fetch(`http://20.127.253.105/subasta/${subastaId}`)
      .then(response => response.json())
      .then(subasta => {
        document.querySelector('.product-name').textContent = subasta.producto.nombre;
        document.querySelector('.product-price').textContent = formatNumber(subasta.precioInicial);
        document.querySelector('.product-owner').textContent = subasta.subastador.nombre;
        var ganadorElement = document.getElementById("ganador");
        var montoElement = document.getElementById("monto");
        if (ganadorElement && montoElement) {
          try {
            ganadorElement.textContent = subasta.ganador.userName;
            montoElement.textContent = formatNumber(subasta.precioFinal);
          } catch (error) {
            ganadorElement.textContent = '';
            montoElement.textContent = '';
          }

        }
        const productImage = document.querySelector('.product-image');
        productImage.src = subasta.producto.img;
        productImage.alt = "Imagen de la subasta";

        const participantsTableBody = document.getElementById('participantsTableBody');
        participantsTableBody.innerHTML = '';

        subasta.oferentes.forEach(participant => {
          participantsTableBody.innerHTML += `<tr class="align-center" ><td>${participant.nombre}</td></tr>`;
        });
      })
      .catch(error => console.error('Error al obtener la subasta actualizada:', error));

  }

  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  }
});
