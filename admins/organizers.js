// Assuming you have already initialized Firebase and have a reference to your database
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIzbybru9FTtUBYQ-V9l5bboT6a9eOuDE",
    authDomain: "hasta-la-fiesta.firebaseapp.com",
    projectId: "hasta-la-fiesta",
    storageBucket: "hasta-la-fiesta.appspot.com",
    messagingSenderId: "1098342569306",
    appId: "1:1098342569306:web:ae62c7538d1a692203cf63"
  };

function loadOrganizers() {
  fetch('https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala.json')
  .then(response => response.json())
  .then(data => {
      if (data) {
          Object.keys(data).forEach(organizerId => {
              const organizerData = data[organizerId];
              const newRow = createOrganizerRow(organizerId, organizerData);
              document.getElementById('all-organizers').appendChild(newRow);
              createEditModalOrganizer(organizerId, organizerData);
          });
      }
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });
}

function createOrganizerRow(organizerId, organizerData) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${organizerData.naziv}</td>
        <td>${organizerData.adresa}</td>
        <td>${organizerData.godinaOsnivanja}</td>
        <td><a href="${organizerData.logo}">${organizerData.logo}<a> </td>
        <td>${organizerData.kontaktTelefon}</td>
        <td>${organizerData.email}</td>
        <td><button type="button" class="edit-btn" onclick="showEditOrganizerDialog('${organizerId}')">Izmeni</button></td> 
        <td><button type="button" class="del-btn" onclick="showDeleteConfirmationOrganizer('${organizerId}')">Obriši</button></td>
    `;
    return newRow;
}
  
function createEditModalOrganizer(organizerId, organizerData) {
  const editModal = document.createElement('div');
  editModal.classList.add('modal');
  editModal.classList.add('edit-organizer-modal');
  const editModalContent = document.createElement('div');
  editModalContent.classList.add('modal-content');
  editModalContent.classList.add('edit-organizer-content'); 
  editModal.id = `EditDialog-organizer-${organizerId}`;
  editModal.style.display = 'none';

  // let festivalsHTML = '';

  // if (organizerData.festivali) {
  //   Object.keys(organizerData.festivali).forEach(festivalId => {
  //     const festivalData = organizerData.festivali[festivalId];
  //     festivalsHTML += `<div class="row"><h3>${festivalData.naziv}</h3></div>`;
  //   });
  // }

  editModalContent.innerHTML = `
      <span class="close" onclick="hideEditOrganizerDialog('${organizerId}')">&times;</span>
      <h2>Izmena organizatora</h2>
      <div class="row">
        <div class="col">
          <label for="name">Naziv:</label>
          <input type="text" id="edit-name-${organizerId}" name="name" value="${organizerData.naziv || ''}"><br>
          <label for="address">Adresa:</label>
          <input type="text" id="edit-address-${organizerId}" name="address" value="${organizerData.adresa || ''}"><br>
          <label for="year">Godina osnivanja:</label>
          <input type="number" id="edit-year-${organizerId}" name="year" value="${organizerData.godinaOsnivanja || ''}"><br>
          <label for="logo">Link do logoa:</label>
          <input type="text" id="edit-logo-${organizerId}" name="logo" value="${organizerData.logo || ''}"><br>
          <label for="phone">Kontakt telefon:</label>
          <input type="tel" id="edit-phone-${organizerId}" name="phone" value="${organizerData.kontaktTelefon || ''}"><br>
          <label for="birthdate">Email:</label>
          <input type="email" id="edit-email-${organizerId}" name="email" value="${organizerData.email || ''}"><br>
        </div>

        <div class="col" id="festivals-organizer-${organizerId}">
        </div>
        <button type="button" class="confirmbtn" onclick="editOrganizer('${organizerId}')" style="align-self: center;">Izmeni</button>
        <button type="button" class="cancelbtn" onclick="hideEditOrganizerDialog('${organizerId}')">Otkaži</button>
      </div>
  `;
  
  editModal.appendChild(editModalContent);
  document.body.appendChild(editModal);
}


loadOrganizers();
  
function showDeleteConfirmationOrganizer(organizerId) {
  var confirmationModal = document.getElementById('deleteConfirmationModal-organizer');
  confirmationModal.style.display = 'block';
  confirmationModal.setAttribute('data-organizer-id',organizerId);
}

function hideDeleteConfirmationOrganizer() {
  document.getElementById('deleteConfirmationModal-organizer').style.display = 'none';
}
  
// function deleteOrganizer() {
//   var organizerId = document.getElementById('deleteConfirmationModal-organizer').getAttribute('data-organizer-id');
//   fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}.json`, {
//     method: 'DELETE'
//   })
//   .then(response => {
//     if (response.ok) {
//       alert('Uspešno ste obrisali organizatora festivala!');
//       location.reload();
//     } else {
//       throw new Error('Neuspelo brisanje organizatora. Molimo pokušajte ponovo.');
//     }
//   })
//   .catch(error => {
//     alert('Došlo je do greške pri brisanju: ' + error.message);
//     console.error('Error deleting organizer:', error);
//   });
//   hideDeleteConfirmationOrganizer();
// }

function deleteOrganizer() {
  var organizerId = document.getElementById('deleteConfirmationModal-organizer').getAttribute('data-organizer-id');

  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}/festivali.json`)
    .then(response => response.json())
    .then(festivalsData => {
      const savedFestivalData = festivalsData;

      fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}.json`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            alert('Uspešno ste obrisali organizatora festivala!');
              const savedFestivalKey = savedFestivalData.festivali
              fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala//festivali/${savedFestivalKey}.json`, {
                method: 'DELETE'
              })
                .then(() => {
                  console.log('Uspešno obrisani festivali ovog organizatora.');
                })
                .catch(error => {
                  console.error('Greška pri brisanju festivala.');
                });
            ;

            location.reload();
          } else {
            throw new Error('Neuspelo brisanje organizatora. Molimo pokušajte ponovo.');
          }
        })
        .catch(error => {
          alert('Došlo je do greške pri brisanju: ' + error.message);
          console.error('Error deleting organizer:', error);
        });
    })
    .catch(error => {
      alert('Došlo je do greške pri dobavljanju podataka o festivalima: ' + error.message);
      console.error('Error fetching festivals data:', error);
    });

  hideDeleteConfirmationOrganizer();
}


function showEditOrganizerDialog(organizerId) {
  document.getElementById(`EditDialog-organizer-${organizerId}`).style.display = 'block';
}

function hideEditOrganizerDialog(organizerId) {
  document.getElementById(`EditDialog-organizer-${organizerId}`).style.display = 'none';
}


function editOrganizer(organizerId) {
  var updatedOrganizerData = {
    naziv: document.getElementById(`edit-name-${organizerId}`).value,
    adresa: document.getElementById(`edit-address-${organizerId}`).value,
    godinaOsnivanja: document.getElementById(`edit-year-${organizerId}`).value,
    logo: document.getElementById(`edit-logo-${organizerId}`).value,
    kontaktTelefon: document.getElementById(`edit-phone-${organizerId}`).value,
    email: document.getElementById(`edit-email-${organizerId}`).value,
  
  };

  fetch(`https://hasta-la-fiesta-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/${organizerId}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedOrganizerData)
  })
  .then(response => {
    if (response.ok) {
      alert('Uspešno ste izmenili podatke organizatora festivala!');
      location.reload();
    } else {
      throw new Error('Neuspela izmena podataka organizatora. Molimo pokušajte ponovo.');
    }
  })
  .catch(error => {
    alert('Došlo je do greške pri izmeni podataka: ' + error.message);
    console.error('Error editing organizer:', error);
  });
}

