// Function to reveal the Bird creation modal and the backdrop
function showBirdModal() {
  var birdModal = document.getElementById("create-bird-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  birdModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to reveal the Subject creation modal and the backdrop
function showSubjectModal() {
  var subjectModal = document.getElementById("create-subject-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  subjectModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to reveal the Handler creation modal and the backdrop
function showHandlerModal() {
  var handlerModal = document.getElementById("create-handler-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  handlerModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to reveal the Station creation modal and the backdrop
function showStationModal() {
  var stationModal = document.getElementById("create-station-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  stationModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to close open creation modals and hide the backdrop
function closeModal() {
  var birdModal = document.getElementById("create-bird-modal");
  var subjectModal = document.getElementById("create-subject-modal");
  var handlerModal = document.getElementById("create-handler-modal");
  var stationModal = document.getElementById("create-station-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");

  birdModal.classList.add("hidden");
  subjectModal.classList.add("hidden");
  handlerModal.classList.add("hidden");
  stationModal.classList.add("hidden");
  modalBackdrop.classList.add("hidden");
}

function deleteBird(id) {
  if (!id) {
    return undefined;
  } else {
    fetch(`/deleteBird/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status == 200) {
        alert("Bird deleted succesfully");
        window.location.replace("/view/bird/");
      } else {
        alert("ERROR: Failed to delete bird");
      }
    });
  }
}

function deleteHandler(codename) {
  if (!codename) {
    return undefined;
  } else {
    fetch(`/deleteHandler/${codename}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status == 200) {
        alert("Handler deleted succesfully");
        window.location.replace("/view/handler/");
      } else {
        alert("ERROR: Failed to delete handler");
      }
    });
  }
}

function deleteSubject(id) {
  if (!id) {
    return undefined;
  } else {
    fetch(`/deleteSubject/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status == 200) {
        alert("Subject deleted succesfully");
        window.location.replace("/view/subject/");
      } else {
        alert("ERROR: Failed to delete subject");
      }
    });
  }
}

/* #########################################################
 * After DOM content is loaded, watches for UI interactions
 * ######################################################### */
window.addEventListener("DOMContentLoaded", function () {});
