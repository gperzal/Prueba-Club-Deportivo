
const form = document.getElementById('sportForm');
const sportsTableBody = document.getElementById('sportsTable').querySelector('tbody');

//Paginación
let currentPage = 1;
const recordsPerPage = 10;
let totalPages = 0;


// Función para cargar los deportes registrados
// function loadSports() {
//   axios.get('/api/sports')
//     .then(response => {
//       const sports = response.data;
//       sportsTableBody.innerHTML = ''; // Limpiar la tabla
//       sports.forEach((sport, index) => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <th scope="row">${index + 1}</th>
//           <td>${sport.name}</td>
//           <td>${sport.price}</td>
//           <td>
//             <button class="btn btn-warning btn-sm update-btn" data-id="${sport.id}">Actualizar</button>
//             <button class="btn btn-danger btn-sm delete-btn" data-id="${sport.id}">Eliminar</button>
//           </td>
//         `;
//         sportsTableBody.appendChild(row);
//       });
function loadSports() {
  axios.get(`/api/sports?page=${currentPage}&limit=${recordsPerPage}`)
    .then(response => {
      const sports = response.data.sports || [];
      const totalRecords = response.data.total;
      totalPages = Math.ceil(totalRecords / recordsPerPage);
      sportsTableBody.innerHTML = '';
      console.log(sports);
      sports.forEach((sport, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td >${sport.name}</td>
          <td>${sport.price}</td>
          <td>
            <button class="btn btn-warning btn-sm update-btn" data-id="${sport.id}">Actualizar</button>
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
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;

  axios.post('/api/sports', { name, price })
    .then(() => {
      form.reset(); // Resetea el formulario
      loadSports(); // Recarga la tabla
    })
    .catch(error => console.error(error));
});

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
