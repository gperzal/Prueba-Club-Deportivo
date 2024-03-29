
const form = document.getElementById('sportForm');
const sportsTableBody = document.getElementById('sportsTable').querySelector('tbody');

//Paginación
let currentPage = 1;
const recordsPerPage = 10;
let totalPages = 0;

function loadSports() {
  axios.get(`/api/sports?page=${currentPage}&limit=${recordsPerPage}`)
    .then(response => {
      let sports = response.data.sports || [];
      const totalRecords = response.data.total;

      // Ordenar los deportes por ID de forma ascendente
      sports = sports.sort((a, b) => a.id - b.id);

      totalPages = Math.ceil(totalRecords / recordsPerPage);
      sportsTableBody.innerHTML = '';
      sports.forEach(sport => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th scope="row">${sport.id}</th>
          <td>${sport.name}</td>
          <td>${sport.price}</td>
          <td>
            <button class="btn btn-info btn-sm update-btn" data-id="${sport.id}">Actualizar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${sport.id}">Eliminar</button>
          </td>
        `;
        sportsTableBody.appendChild(row);
      });

      // Agregar event listeners después de construir la tabla
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
          deleteSport(this.getAttribute('data-id'));
        });
      });

      document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', function () {
          const sportId = this.getAttribute('data-id');
          const sport = sports.find(s => s.id.toString() === sportId);
          if (sport) {
            showUpdateSportModal(sport.id, sport.name, sport.price);
          }
        });
      });
      updatePagination();
    })
    .catch(error => console.error(error));
}




function updatePagination() {
  const paginationUl = document.querySelector('.pagination');
  const prevPageLi = document.getElementById('prevPage');
  const nextPageLi = document.getElementById('nextPage');

  // Limpia los números de página existentes, excepto "Anterior" y "Siguiente"
  paginationUl.querySelectorAll('li.page-number').forEach(li => li.remove());

  // Agrega números de página
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement('li');
    pageLi.className = `page-item page-number ${i === currentPage ? 'active' : ''}`;
    pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageLi.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      loadSports();
    });

    // Inserta el nuevo elemento <li> antes del elemento "Siguiente"
    paginationUl.insertBefore(pageLi, nextPageLi);
  }

  // Habilita o deshabilita "Anterior" y "Siguiente"
  prevPageLi.classList.toggle('disabled', currentPage === 1);
  nextPageLi.classList.toggle('disabled', currentPage === totalPages);
}


// Asegúrate de agregar los event listeners para "Anterior" y "Siguiente" solo una vez, fuera de la función updatePagination
document.getElementById('prevPage').querySelector('a').addEventListener('click', (e) => {
  e.preventDefault();
  if (currentPage > 1) {
    currentPage--;
    loadSports();
  }
});

document.getElementById('nextPage').querySelector('a').addEventListener('click', (e) => {
  e.preventDefault();
  if (currentPage < totalPages) {
    currentPage++;
    loadSports();
  }
});




function showUpdateSportModal(id, name, price) {
  document.getElementById('updateId').value = id;
  document.getElementById('updateName').value = name;
  document.getElementById('updatePrice').value = price;

  var updateModal = new bootstrap.Modal(document.getElementById('updateSportModal'), {
    keyboard: false
  });
  updateModal.show();
}

function updateSport(id, newName, newPrice) {
  axios.put(`/api/sports/${id}`, { name: newName, price: newPrice })
    .then(() => {
      // Cerrar el modal
      console.log(axios.put(`/api/sports/${id}`, { name: newName, price: newPrice }));
      var updateModal = bootstrap.Modal.getInstance(document.getElementById('updateSportModal'));
      updateModal.hide();

      loadSports(); // Recarga la tabla para mostrar los datos actualizados
    })
    .catch(error => console.error(error));

}


document.getElementById('saveChanges').addEventListener('click', function () {
  const id = document.getElementById('updateId').value;
  const name = document.getElementById('updateName').value;
  const price = document.getElementById('updatePrice').value;

  updateSport(id, name, price);
});


// Función para agregar un nuevo deporte
// Modifica esta función para usar getLowestAvailableId
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;

  // Enviar directamente el nuevo deporte sin ID al servidor
  axios.post('/api/sports', { name, price })
    .then(() => {
      form.reset(); // Resetea el formulario
      loadSports(); // Recarga la tabla para mostrar los datos actualizados
    })
    .catch(error => console.error(error));
})

// Función para eliminar un deporte
function deleteSport(id) {
  axios.delete(`/api/sports/${id}`)
    .then(() => {
      loadSports(); // Recarga la tabla
    })
    .catch(error => console.error(error));
}

// Cargar deportes al iniciar
window.onload = loadSports;

const nameInput = document.getElementById('namefilter');

const iconSpan = document.getElementById('validationIcon'); // Asegúrate de agregar este elemento en tu HTML


// Elimina caracteres que no coincidan con la expresión regular
document.getElementById('name').addEventListener('input', function (e) {
  this.value = this.value.replace(/[^A-Za-z]/g, '');
});


nameInput.addEventListener('input', (e) => {
  const searchValue = e.target.value.toLowerCase();

  // Solo realiza la búsqueda si searchValue no está vacío
  if (searchValue) {
    // Realiza una solicitud al servidor para obtener los deportes filtrados
    axios.get(`/api/sports/search?name=${searchValue}`)
      .then(response => {
        const matchingSports = response.data;

        // Actualiza la tabla con los resultados de la búsqueda
        updateTableWithSearchResults(matchingSports);

        // Decide qué icono mostrar
        if (matchingSports.length === 0) {
          iconSpan.innerHTML = '<i class="bi bi-x-circle-fill" style="color: red;"></i>'; // No hay coincidencias
        } else {
          iconSpan.innerHTML = '<i class="bi bi-check-circle-fill" style="color: green;"></i>'; // Coincidencias encontradas
        }
      })
      .catch(error => console.error(error));
  } else {
    // Si el campo de búsqueda está vacío, vuelve a cargar todos los deportes y quita el icono
    loadSports();
    iconSpan.innerHTML = ''; // Quita el icono
  }
});

function updateTableWithSearchResults(matchingSports) {
  sportsTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar los resultados de búsqueda
  matchingSports.forEach((sport) => {
    // El resto del código para agregar las filas a la tabla
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">${sport.id}</th>
      <td>${sport.name}</td>
      <td>${sport.price}</td>
      <td>
        <button class="btn btn-warning btn-sm update-btn" data-id="${sport.id}">Actualizar</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${sport.id}">Eliminar</button>
      </td>
    `;
    sportsTableBody.appendChild(row);
  });
}

function updateValidationIcon(matchingSports, searchValue) {
  const iconSpan = document.getElementById('validationIcon');

  if (searchValue && matchingSports.length === 0) {
    iconSpan.innerHTML = '<i class="bi bi-x-circle-fill" style="color: red;"></i>';
  } else if (searchValue) {
    const exactMatch = matchingSports.some(sport => sport.name.toLowerCase() === searchValue.toLowerCase());
    iconSpan.innerHTML = exactMatch ? '<i class="bi bi-check-circle-fill" style="color: green;"></i>' : '';
  } else {
    iconSpan.innerHTML = '';
  }
}

