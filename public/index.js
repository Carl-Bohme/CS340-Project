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

// Function to reveal the Station update modal and the backdrop
function showStationModal() {
  var stationModal = document.getElementById("update-station-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  stationModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

//Functions for showing the update modals
//Function to reveal the Bird update modal and the backdrop
function showUpdateBirdModal() {
  var birdModal = document.getElementById("update-bird-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  birdModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to reveal the Subject update modal and the backdrop
function showUpdateSubjectModal() {
  var subjectModal = document.getElementById("update-subject-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  subjectModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to reveal the Handler update modal and the backdrop
function showUpdateHandlerModal() {
  var handlerModal = document.getElementById("update-handler-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  handlerModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}

// Function to reveal the Station update modal and the backdrop
function showUpdateStationModal() {
  var stationModal = document.getElementById("update-station-modal");
  var modalBackdrop = document.getElementById("modal-backdrop");
  stationModal.classList.remove("hidden");
  modalBackdrop.classList.remove("hidden");
}


// Function to close open creation modals and hide the backdrop
function closeModal() {
  //blindly grab all modals
  var modals =
  [
    document.getElementById("create-bird-modal"),
    document.getElementById("create-subject-modal"),
    document.getElementById("create-handler-modal"),
    document.getElementById("create-station-modal"),
    document.getElementById("update-bird-modal"),
    document.getElementById("update-subject-modal"),
    document.getElementById("update-handler-modal"),
    document.getElementById("update-station-modal"),
    document.getElementById("modal-backdrop")
  ];

  for (i = 0; i < modals.length; i++){
    if(modals[i] !=null) //skip a modal if the modal is null
      modals[i].classList.add("hidden");
  }

}

function updateBird(id) {
  if (!id) {
    return undefined;
  } else {
    fetch(`/updateBird/${id}`, {
      method: "post",
    }).then((res) => {
      if (res.status == 200) {
        alert("Bird updated succesfully");
        window.location.replace("/view/bird/");
      } else {
        alert("ERROR: Failed to update bird");
      }
    });
  }
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

function deleteStation(name) {
  if (!name) {
    return undefined;
  } else {
    fetch(`/deleteStation/${name}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status == 200) {
        alert("Station deleted succesfully");
        window.location.replace("/view/station/");
      } else {
        alert("ERROR: Failed to delete station");
      }
    });
  }
}

/* #########################################################
 * After DOM content is loaded, watches for UI interactions
 * ######################################################### */
window.addEventListener("DOMContentLoaded", function () {});
