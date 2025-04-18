
  document.addEventListener("DOMContentLoaded", function () {
  // Load user data
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  let socket = null;
  let selectedContact = null;
  let clientName = "User"; // Default name until fetched

  if (!token || !email) {
  window.location.href = "login.html";
  return;
}

  // Fetch client profile to get the full name
  fetchClientProfile();

  // Set welcome message with client name
  document.getElementById("welcomeMessage").textContent = `Welcome, ${clientName}!`;
  document.getElementById("client-name").textContent = clientName;

  // Navigation functionality (unchanged)
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
  const contentSections = document.querySelectorAll(".content-section");
  const sectionTitle = document.getElementById("section-title");

  navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
  e.preventDefault();
  navLinks.forEach(navLink => navLink.classList.remove("active"));
  this.classList.add("active");
  const targetSectionId = this.getAttribute("data-section");
  contentSections.forEach(section => section.classList.remove("active"));
  document.getElementById(targetSectionId).classList.add("active");
  sectionTitle.textContent = this.textContent.trim();

  if (targetSectionId === "clients-section") {
  fetchLawyers();
} else if (targetSectionId === "message-section") {
  initializeMessaging();
} else if (targetSectionId === "appointments-section") {
  initializeAppointments();
} else if (socket && socket.readyState === WebSocket.OPEN) {
  socket.close();
}
});
});

  // Initialize dashboard
  safeInitialize();

  // Handle profile form submission
  document.getElementById("profile-form").addEventListener("submit", function (e) {
  e.preventDefault();
  updateClientProfile();
});

  // Profile picture upload
  const profilePictureInput = document.getElementById("profile-picture");
  profilePictureInput.addEventListener("change", function () {
  uploadProfilePicture(this.files[0]);
});

  // Profile picture delete
  document.getElementById("delete-profile-pic").addEventListener("click", function () {
  deleteProfilePicture();
});

  // Case submission
  document.getElementById("case-submit-form").addEventListener("submit", function (e) {
  e.preventDefault();
  submitCase();
});

  // Check case status
  document.getElementById("check-status-btn").addEventListener("click", function () {
  checkCaseStatus();
});

  // District options by province (unchanged)
  const districtsByProvince = {
  "Western": ["Colombo", "Gampaha", "Kalutara"],
  "Central": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern": ["Galle", "Matara", "Hambantota"],
  "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "Eastern": ["Batticaloa", "Ampara", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "Uva": ["Badulla", "Monaragala"],
  "Sabaragamuwa": ["Ratnapura", "Kegalle"]
};

  const provinceSelect = document.getElementById("provinceSelect");
  const districtSelect = document.getElementById("districtSelect");
  const filterBtn = document.getElementById("filterBtn");

  provinceSelect.addEventListener("change", function () {
  const selectedProvince = this.value;
  districtSelect.innerHTML = '<option value="">Select District</option>';
  if (districtsByProvince[selectedProvince]) {
  districtsByProvince[selectedProvince].forEach(district => {
  const option = document.createElement("option");
  option.value = district;
  option.textContent = district;
  districtSelect.appendChild(option);
});
}
});

  filterBtn.addEventListener("click", function () {
  const province = provinceSelect.value;
  const district = districtSelect.value;
  fetchLawyers(province, district);
});

  // Logout functionality
  document.getElementById("logout-btn").addEventListener("click", function () {
  if (socket) {
  socket.close();
}
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.href = "login.html";
});

  // Deactivate account functionality
  document.getElementById("confirm-deactivate-btn").addEventListener("click", function () {
  const confirmEmail = document.getElementById("deactivate-confirm-email").value;
  if (confirmEmail === email) {
  deactivateAccount();
} else {
  alert("Email does not match your account email.");
}
});

  // Appointment Functions (unchanged)
  function initializeAppointments() {
  fetchLawyersForAppointment();
  fetchClientAppointments();
  const appointmentForm = document.getElementById("appointment-schedule-form");
  if (appointmentForm) {
  appointmentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  scheduleAppointment();
});
}
}

  function fetchLawyersForAppointment() {
  const lawyerSelect = document.getElementById("lawyerEmail");
  lawyerSelect.innerHTML = '<option value="" selected disabled>Loading lawyers...</option>';

  $.ajax({
  url: "http://localhost:8080/api/v1/user/lawyers",
  method: "GET",
  headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
},
  success: function (response) {
  lawyerSelect.innerHTML = '<option value="" selected disabled>Select a lawyer</option>';
  if (response && response.code === 200 && Array.isArray(response.data)) {
  response.data.forEach(lawyer => {
  if (lawyer.email && lawyer.lawyer_name) {
  const option = document.createElement("option");
  option.value = lawyer.email;
  option.textContent = `${lawyer.lawyer_name} (${lawyer.specialization || 'General Practice'})`;
  lawyerSelect.appendChild(option);
}
});
} else {
  lawyerSelect.innerHTML = '<option value="" selected disabled>No lawyers available</option>';
}
},
  error: function (xhr) {
  console.error("Error fetching lawyers for appointment:", xhr);
  lawyerSelect.innerHTML = '<option value="" selected disabled>Error loading lawyers</option>';
}
});
}

  function scheduleAppointment() {
  const form = document.getElementById("appointment-schedule-form");
  const submitBtn = document.getElementById("submit-appointment-btn");
  const messageDiv = document.getElementById("appointment-message");

  if (!form.checkValidity()) {
  form.classList.add("was-validated");
  return;
}

  const appointmentData = {
  lawyerEmail: document.getElementById("lawyerEmail").value,
  clientEmail: email,
  appointmentTime: new Date(document.getElementById("appointmentTime").value).toISOString(),
  googleMeetLink: document.getElementById("googleMeetLink").value || null,
  status: "PENDING"
};

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Scheduling...';
  messageDiv.classList.add("d-none");

  $.ajax({
  url: "http://localhost:8080/api/v1/appointment/schedule",
  method: "POST",
  headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
},
  data: JSON.stringify(appointmentData),
  success: function (response) {
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="bi bi-calendar-check me-2"></i>Schedule Appointment';
  if (response) {
  messageDiv.innerHTML = `
            <div class="alert alert-success">
              <i class="bi bi-check-circle-fill me-2"></i> Appointment scheduled successfully!
            </div>`;
  form.reset();
  form.classList.remove("was-validated");
  fetchClientAppointments(); // Refresh appointments list
} else {
  messageDiv.innerHTML = `<div class="alert alert-danger">Error: Failed to schedule appointment</div>`;
}
  messageDiv.classList.remove("d-none");
},
  error: function (xhr) {
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="bi bi-calendar-check me-2"></i>Schedule Appointment';
  const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error scheduling appointment';
  messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${errorMsg}</div>`;
  messageDiv.classList.remove("d-none");
  console.error("Error scheduling appointment:", xhr);
}
});
}

  function fetchClientAppointments() {
  const appointmentsList = document.getElementById("appointments-list");
  const errorAlert = document.getElementById("appointments-error");

  appointmentsList.innerHTML = `
      <div class="col-12 text-center" id="appointments-loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Loading appointments...</p>
      </div>`;
  errorAlert.classList.add("d-none");

  $.ajax({
  url: "http://localhost:8080/api/v1/appointment/client",
  method: "GET",
  headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
},
  success: function (response) {
  if (response && Array.isArray(response)) {
  displayAppointments(response);
} else {
  appointmentsList.innerHTML = '<p class="text-center text-muted">No appointments found.</p>';
}
},
  error: function (xhr) {
  console.error("Error fetching appointments:", xhr);
  appointmentsList.innerHTML = "";
  errorAlert.classList.remove("d-none");
}
});
}

  function displayAppointments(appointments) {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "";
  if (!appointments.length) {
  appointmentsList.innerHTML = '<p class="text-center text-muted">No appointments scheduled.</p>';
  return;
}

  appointments.forEach(appointment => {
  const appointmentCard = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card appointment-card h-100 border-0 rounded-xl shadow-lg overflow-hidden">
            <div class="card-body p-4 d-flex flex-column">
              <div class="d-flex align-items-center gap-3 mb-3">
                <i class="bi bi-person-circle text-primary text-2xl"></i>
                <div>
                  <h5 class="mb-0 text-dark font-semibold">Lawyer: ${appointment.lawyerEmail}</h5>
                  <span class="status-badge status-${appointment.status.toLowerCase()} mt-1">${appointment.status}</span>
                </div>
              </div>
              <p class="card-text mb-2 text-dark text-sm">
                <i class="bi bi-calendar-event me-2 text-primary"></i>
                ${new Date(appointment.appointmentTime).toLocaleString()}
              </p>
              <p class="card-text mb-4 text-dark text-sm">
                <i class="bi bi-link-45deg me-2 text-primary"></i>
                ${appointment.googleMeetLink ? `<a href="${appointment.googleMeetLink}" target="_blank" class="text-primary">Join Meeting</a>` : 'No meeting link'}
              </p>
              ${appointment.status === 'PENDING' ? `
                <button
                  onclick="cancelAppointment(${appointment.id})"
                  class="btn btn-outline-danger rounded-md py-2 mt-auto hover:bg-red-50 transition-all duration-300"
                >
                  <i class="bi bi-x-circle me-2"></i>Cancel Appointment
                </button>
              ` : ''}
            </div>
          </div>
        </div>`;
  appointmentsList.innerHTML += appointmentCard;
});
}

  window.cancelAppointment = function(appointmentId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;

  const cancelBtn = event.target;
  cancelBtn.disabled = true;
  cancelBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Canceling...';

  $.ajax({
  url: `http://localhost:8080/api/v1/appointment/${appointmentId}/cancel`,
  method: "DELETE",
  headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
},
  success: function () {
  cancelBtn.disabled = false;
  cancelBtn.innerHTML = '<i class="bi bi-x-circle me-2"></i>Cancel Appointment';
  showAlert("success", "Appointment canceled successfully!");
  fetchClientAppointments();
},
  error: function (xhr) {
  cancelBtn.disabled = false;
  cancelBtn.innerHTML = '<i class="bi bi-x-circle me-2"></i>Cancel Appointment';
  const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error canceling appointment';
  showAlert("danger", errorMsg);
  console.error("Error canceling appointment:", xhr);
}
});
};

  // Messaging Functions (unchanged)
  function initializeMessaging() {
  if (socket && socket.readyState === WebSocket.OPEN) {
  return; // Prevent multiple connections
}

  socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

  socket.onopen = () => {
  document.getElementById("chat-status").textContent = "Connected";
  document.getElementById("chat-status").classList.replace("bg-secondary", "bg-success");
  fetchContacts();
};

  socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (selectedContact && (message.senderEmail === selectedContact || message.recipientEmail === selectedContact)) {
  displayMessage(message);
}
};

  socket.onclose = () => {
  document.getElementById("chat-status").textContent = "Disconnected";
  document.getElementById("chat-status").classList.replace("bg-success", "bg-secondary");
  socket = null;
  setTimeout(initializeMessaging, 5000); // Attempt to reconnect
};

  socket.onerror = (error) => {
  console.error("WebSocket error:", error);
  document.getElementById("chat-messages").innerHTML =
  '<div class="alert alert-danger">Failed to connect to messaging service. Please refresh.</div>';
};
}

  function fetchContacts() {
  const contactList = document.getElementById("contact-list");
  contactList.innerHTML =
  '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading lawyers...</p></div>';

  $.ajax({
  url: "http://localhost:8080/api/v1/user/lawyers",
  method: "GET",
  headers: {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
},
  success: function (response) {
  contactList.innerHTML = "";
  if (response && response.code === 200 && Array.isArray(response.data) && response.data.length > 0) {
  // Filter valid lawyers with email and lawyer_name
  const validLawyers = response.data.filter(lawyer =>
  lawyer &&
  typeof lawyer.email === 'string' && lawyer.email.trim() !== '' &&
  (lawyer.lawyer_name || lawyer.email)
  );
  if (validLawyers.length > 0) {
  populateContactList(validLawyers);
} else {
  contactList.innerHTML = '<p class="text-muted">No lawyers available to contact.</p>';
}
} else {
  contactList.innerHTML = '<p class="text-muted">No lawyers found.</p>';
  console.warn("Invalid response structure:", response);
}
},
  error: function (xhr, status, error) {
  contactList.innerHTML = `
          <div class="alert alert-warning">
            Failed to load lawyers: ${xhr.status} ${xhr.statusText}.
            <button class="btn btn-link p-0 m-0 align-baseline" onclick="fetchContacts()">Retry</button>
          </div>`;
  console.error("Error fetching lawyers:", {
  status: xhr.status,
  statusText: xhr.statusText,
  response: xhr.responseJSON || xhr.responseText,
  error: error
});
}
});
}

  function populateContactList(lawyers) {
  const contactList = document.getElementById("contact-list");
  if (!contactList) {
  console.error("Contact list element not found");
  return;
}

  contactList.innerHTML = "";
  lawyers.forEach(lawyer => {
  const li = document.createElement("li");
  li.className = "list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4 border-0";
  li.innerHTML = `
        <img
          src="${lawyer.profilePictureUrl || 'https://via.placeholder.com/40'}"
          class="rounded-circle border-2 border-primary shadow-sm"
          alt="${lawyer.lawyer_name || lawyer.email}"
          style="width: 40px; height: 40px; object-fit: cover;"
        >
        <div class="flex-grow-1">
          <h6 class="mb-0 text-dark font-semibold">${lawyer.lawyer_name || lawyer.email}</h6>
          <small class="text-muted">${lawyer.specialization || "General Practice"}</small>
        </div>
      `;
  li.dataset.email = lawyer.email;
  li.dataset.name = lawyer.lawyer_name || lawyer.email;
  li.addEventListener("click", () =>
  selectContact(lawyer.email, lawyer.lawyer_name || lawyer.email)
  );
  contactList.appendChild(li);
});
}

  function selectContact(contactEmail, contactName) {
  selectedContact = contactEmail;
  document.getElementById("chat-with").textContent = `Chat with ${contactName}`;

  // Update active contact styling
  document.querySelectorAll("#contact-list .list-group-item").forEach(item => {
  item.classList.toggle("active", item.dataset.email === contactEmail);
});

  // Clear and fetch chat history
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>';
  fetchChatHistory(contactEmail);
}

  function fetchChatHistory(contactEmail) {
  $.ajax({
  url: `http://localhost:8080/api/v1/user/messages?senderEmail=${email}&recipientEmail=${contactEmail}`,
  method: "GET",
  headers: { "Authorization": `Bearer ${token}` },
  success: (response) => {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";
  if (response.code === 200 && response.data && response.data.length > 0) {
  response.data.forEach(displayMessage);
} else {
  chatMessages.innerHTML = '<div class="text-center text-muted mt-5">No messages yet</div>';
}
},
  error: (xhr) => {
  console.error("Error fetching chat history:", xhr);
  document.getElementById("chat-messages").innerHTML =
  '<div class="alert alert-danger">Error loading chat history</div>';
}
});
}

  function displayMessage(message) {
  const chatMessages = document.getElementById("chat-messages");
  const isSent = message.senderEmail === email;
  const div = document.createElement("div");
  div.className = `chat-message mb-2 p-2 rounded ${isSent ? "bg-primary text-white ms-auto" : "bg-light text-dark"}`;
  div.style.maxWidth = "70%";
  div.innerHTML = `
      <div>${message.content}</div>
      <small class="d-block text-muted">${new Date(message.timestamp).toLocaleTimeString()}</small>
    `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

  document.getElementById("message-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
  alert("Not connected to messaging service. Please wait or refresh.");
  return;
}
  if (!selectedContact) {
  const firstContact = document.querySelector("#contact-list .list-group-item");
  if (firstContact) {
  selectContact(firstContact.dataset.email, firstContact.dataset.name);
} else {
  alert("No contacts available to chat with.");
  return;
}
}

  const messageInput = document.getElementById("message-input");
  const content = messageInput.value.trim();
  if (!content) return;

  const message = {
  senderEmail: email,
  recipientEmail: selectedContact,
  content: content,
  timestamp: new Date().toISOString()
};

  socket.send(JSON.stringify(message));
  displayMessage(message);
  messageInput.value = "";
});

  // Profile Functions
  function fetchClientProfile() {
  $.ajax({
  url: `http://localhost:8080/api/v1/user/client?email=${email}`,
  method: "GET",
  headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
},
  success: function (response) {
  if (response.code === 200 && response.data) {
  clientName = response.data.full_name || "User"; // Update clientName with the fetched full name
  document.getElementById("welcomeMessage").textContent = `Welcome, ${clientName}!`;
  document.getElementById("client-name").textContent = clientName;
  populateProfileForm(response.data);
  updateProfilePicture(response.data.profilePictureUrl);
} else {
  console.error("Error fetching client profile:", response.message);
}
},
  error: function (xhr) {
  console.error("Error fetching client profile:", xhr);
}
});
}

  function populateProfileForm(data) {
  document.getElementById("lawyer_name").value = data.full_name || "";
  document.getElementById("contactNumber").value = data.phone_number || "";
  document.getElementById("address").value = data.address || "";
  document.getElementById("gender").value = data.gender || "";
}

  function updateProfilePicture(url) {
  const profilePic = document.getElementById("profile-pic");
  const headerProfilePic = document.getElementById("header-profile-pic");
  const defaultPic = "https://via.placeholder.com/100";
  const defaultHeaderPic = "https://via.placeholder.com/36";
  profilePic.src = url || defaultPic;
  headerProfilePic.src = url || defaultHeaderPic;
}

  function uploadProfilePicture(file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const uploadBtn = document.querySelector('label[for="profile-picture"]');
  uploadBtn.disabled = true;
  uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...';

  $.ajax({
  url: `http://localhost:8080/api/v1/user/${email}/profile-picture`,
  method: "POST",
  headers: {
  "Authorization": `Bearer ${token}`
},
  data: formData,
  processData: false,
  contentType: false,
  success: function (response) {
  uploadBtn.disabled = false;
  uploadBtn.innerHTML = '<i class="bi bi-camera-fill text-lg"></i>';
  if (response.profilePictureUrl) {
  updateProfilePicture(response.profilePictureUrl);
  showAlert("success", "Profile picture uploaded successfully!");
} else {
  showAlert("danger", "Failed to upload profile picture.");
}
},
  error: function (xhr) {
  uploadBtn.disabled = false;
  uploadBtn.innerHTML = '<i class="bi bi-camera-fill text-lg"></i>';
  console.error("Error uploading profile picture:", xhr);
  showAlert("danger", xhr.responseJSON?.message || "Error uploading profile picture.");
}
});
}

  function deleteProfilePicture() {
  const deleteBtn = document.getElementById("delete-profile-pic");
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting...';

  $.ajax({
  url: `http://localhost:8080/api/v1/user/${email}/profile-picture`,
  method: "DELETE",
  headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
},
  success: function () {
  deleteBtn.disabled = false;
  deleteBtn.innerHTML = '<i class="bi bi-trash me-1"></i> Delete Picture';
  updateProfilePicture(null);
  showAlert("success", "Profile picture deleted successfully!");
},
  error: function (xhr) {
  deleteBtn.disabled = false;
  deleteBtn.innerHTML = '<i class="bi bi-trash me-1"></i> Delete Picture';
  console.error("Error deleting profile picture:", xhr);
  showAlert("danger", xhr.responseJSON?.message || "Error deleting profile picture.");
}
});
}

  function showAlert(type, message) {
  const alertContainer = document.querySelector(".alert-container");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} d-flex align-items-center`;
  alert.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2"></i>
      ${message}
    `;
  alertContainer.appendChild(alert);
  setTimeout(() => {
  alert.remove();
}, 3000);
}

  function updateClientProfile() {
  const updateBtn = document.getElementById('update-profile-btn');
  const successAlert = document.getElementById('update-success');
  const errorAlert = document.getElementById('update-error');

  successAlert.classList.add('d-none');
  errorAlert.classList.add('d-none');

  updateBtn.disabled = true;
  updateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...';

  const clientUpdateDTO = {
  full_name: document.getElementById('lawyer_name').value,
  phone_number: document.getElementById('contactNumber').value,
  address: document.getElementById('address').value,
  gender: document.getElementById('gender').value
};

  $.ajax({
  url: 'http://localhost:8080/api/v1/user/update-client',
  method: 'PUT',
  headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
},
  data: JSON.stringify(clientUpdateDTO),
  success: function (data) {
  updateBtn.disabled = false;
  updateBtn.innerHTML = '<i class="bi bi-save me-2"></i> Update Profile';

  if (data.code === 200) {
  // Update clientName after successful profile update
  clientName = clientUpdateDTO.full_name || clientName;
  document.getElementById("welcomeMessage").textContent = `Welcome, ${clientName}!`;
  document.getElementById("client-name").textContent = clientName;
  successAlert.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Your profile has been updated successfully!';
  successAlert.classList.remove('d-none');
  setTimeout(() => {
  successAlert.classList.add('d-none');
}, 3000);
} else {
  errorAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i> Error: ${data.message || 'Failed to update profile'}`;
  errorAlert.classList.remove('d-none');
}
},
  error: function (xhr) {
  updateBtn.disabled = false;
  updateBtn.innerHTML = '<i class="bi bi-save me-2"></i> Update Profile';
  console.error('Error updating profile:', xhr);
  errorAlert.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Network error: Unable to update profile. Please try again.';
  errorAlert.classList.remove('d-none');
}
});
}

  function deactivateAccount() {
  const deactivateBtn = document.getElementById("confirm-deactivate-btn");
  deactivateBtn.disabled = true;
  deactivateBtn.innerHTML =
  '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

  $.ajax({
  url: "http://localhost:8080/api/v1/user/delete-client-account",
  method: "POST",
  headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
},
  data: JSON.stringify({ email }),
  success: function (data) {
  deactivateBtn.disabled = false;
  deactivateBtn.innerHTML = "Deactivate Account";
  if (data.code === 200) {
  if (socket) {
  socket.close();
}
  alert("Account deleted successfully");
  localStorage.clear();
  window.location.href = "login.html";
} else {
  alert(data.message || "Error deleting account");
}
},
  error: function (xhr) {
  deactivateBtn.disabled = false;
  deactivateBtn.innerHTML = "Deactivate Account";
  console.error("Error deleting account:", xhr);
  alert("Network error. Please try again.");
}
});
}

  // Lawyer Search Functions (unchanged)
  function fetchLawyers(province = null, district = null) {
  const lawyersList = document.getElementById("lawyersList");
  const errorAlert = document.getElementById("errorAlert");
  errorAlert.classList.add("d-none");

  lawyersList.innerHTML = `
      <div class="col-12 text-center" id="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Loading lawyers...</p>
      </div>`;

  let url = "http://localhost:8080/api/v1/user/lawyers";
  if (province && district) {
  url = `http://localhost:8080/api/v1/user/lawyers-byProvinceDistrict?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}`;
}

  $.ajax({
  url: url,
  method: "GET",
  headers: {
  "Authorization": `Bearer ${token}`
},
  success: function (response) {
  if (response.code === 200) {
  displayLawyers(response.data || []);
} else {
  lawyersList.innerHTML = "<p>No lawyers found.</p>";
}
},
  error: function (xhr, status, error) {
  console.error("Error fetching lawyers:", error);
  lawyersList.innerHTML = "";
  errorAlert.classList.remove("d-none");
}
});
}

  function displayLawyers(lawyers) {
  const lawyersList = document.getElementById("lawyersList");
  lawyersList.innerHTML = "";
  if (!lawyers.length) {
  lawyersList.innerHTML =
  '<p class="text-center text-muted">No lawyers found.</p>';
  return;
}
  lawyers.forEach(lawyer => {
  const lawyerCard = `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card lawyer-card h-100 border-0 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="card-body p-4 d-flex flex-column">
            <div class="lawyer-profile-header d-flex align-items-center gap-3 mb-4">
              <img
                src="${lawyer.profilePictureUrl || "https://via.placeholder.com/60"}"
                class="rounded-circle border-2 border-primary shadow-sm"
                alt="${lawyer.lawyer_name || "Lawyer"}"
                style="width: 60px; height: 60px; object-fit: cover;"
              >
              <div class="flex-grow-1">
                <h5 class="lawyer-name mb-1 text-dark font-semibold">${lawyer.lawyer_name || "Unknown"}</h5>
                <p class="lawyer-specialization mb-0 text-primary font-medium text-sm">${lawyer.specialization || "General Practice"}</p>
              </div>
            </div>
            <p class="card-text mb-4 text-dark text-sm flex-grow-1">
              <i class="bi bi-text-paragraph me-2 text-primary"></i>
              ${truncateBio(lawyer.bio) || "No bio available"}
            </p>
            <div class="lawyer-stats d-flex gap-3 mb-4">
              <div class="stat-item flex-1 text-center">
                <div class="stat-value mb-1">
                  <i class="bi bi-telephone-fill text-primary text-lg"></i>
                </div>
                <div class="stat-label text-dark text-xs">${lawyer.contactNumber || "N/A"}</div>
              </div>
              <div class="stat-item flex-1 text-center">
                <div class="stat-value mb-1">
                  <i class="bi bi-geo-alt-fill text-primary text-lg"></i>
                </div>
                <div class="stat-label text-dark text-xs">${lawyer.district || "N/A"}, ${lawyer.province || "N/A"}</div>
              </div>
            </div>
            <button
              onclick="viewFullProfile(${JSON.stringify(lawyer).replace(/"/g, '"')})"
              class="btn view-profile-btn bg-primary text-white rounded-md py-2 hover:bg-secondary transition-all duration-300 shadow-md"
            >
              <i class="bi bi-eye me-2"></i>View Profile
            </button>
          </div>
        </div>
      </div>`;
  lawyersList.innerHTML += lawyerCard;
});
}

  function truncateBio(bio, maxLength = 100) {
  if (!bio) return '';
  return bio.length > maxLength ? bio.substring(0, maxLength) + '...' : bio;
}

  window.viewFullProfile = function(lawyer) {
  const lawyerProfileURL = `lawyerProfiles.html?email=${encodeURIComponent(lawyer.email)}`;
  window.location.href = lawyerProfileURL;
};

  // Case Functions (unchanged)
  function submitCase() {
  const form = document.getElementById("case-submit-form");
  const description = document.getElementById("caseDescription").value;
  const submitBtn = document.getElementById("submit-case-btn");
  const messageDiv = document.getElementById("case-message");

  if (!form.checkValidity()) {
  form.classList.add("was-validated");
  return;
}

  const caseNumber = `CASE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const caseData = {
  caseNumber: caseNumber,
  description: description,
  clientId: 1 // Replace with actual client ID from auth
};

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

  $.ajax({
  url: "http://localhost:8080/api/v1/case/submit",
  method: "POST",
  headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
},
  data: JSON.stringify(caseData),
  success: function (response) {
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Case';
  if (response.code === 200) {
  const submittedCaseNumber = response.data.caseNumber;
  messageDiv.innerHTML = `
            <div class="alert alert-success">
              <i class="fas fa-check-circle me-2"></i> Case submitted successfully!
              Case Number: <strong id="case-number-display">${submittedCaseNumber}</strong>
              <button class="btn btn-sm btn-outline-primary ms-2" onclick="navigator.clipboard.writeText('${submittedCaseNumber}').then(() => alert('Case number copied to clipboard!'))">
                <i class="bi bi-clipboard me-1"></i> Copy
              </button>
            </div>`;
  form.reset();
  form.classList.remove("was-validated");
} else {
  messageDiv.innerHTML = `<div class="alert alert-danger">Error: ${response.message || 'Unknown error occurred'}</div>`;
}
  messageDiv.classList.remove("d-none");
},
  error: function (xhr, status, error) {
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Case';
  const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Unknown error occurred';
  messageDiv.innerHTML = `<div class="alert alert-danger">Error submitting case: ${errorMsg}</div>`;
  messageDiv.classList.remove("d-none");
}
});
}

  function checkCaseStatus() {
  const caseNumber = document.getElementById("case-number-input").value.trim();
  const resultDiv = document.getElementById("case-status-result");
  const checkBtn = document.getElementById("check-status-btn");

  if (!caseNumber) {
  resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a case number.</div>';
  return;
}

  checkBtn.disabled = true;
  checkBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...';
  resultDiv.innerHTML = '';

  $.ajax({
  url: `http://localhost:8080/api/v1/case/status/${caseNumber}`,
  method: "GET",
  headers: {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
},
  success: function (response) {
  checkBtn.disabled = false;
  checkBtn.innerHTML = '<i class="bi bi-search me-2"></i>Check Status';
  if (response.code === 200 && response.data) {
  const caseData = response.data;
  resultDiv.innerHTML = `
            <div class="status-card bg-white shadow-lg rounded-lg p-4">
              <h5 class="text-primary font-semibold">Case Status: ${caseData.status}</h5>
              <p><strong>Case Number:</strong> ${caseData.caseNumber}</p>
              <p><strong>Description:</strong> ${caseData.description}</p>
              <p><strong>Client:</strong> ${caseData.clientName || 'N/A'}</p>
              <p><strong>Lawyer:</strong> ${caseData.lawyerName || 'Not Assigned'}</p>
              <p><strong>Created At:</strong> ${new Date(caseData.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> ${new Date(caseData.updatedAt).toLocaleString()}</p>
            </div>
          `;
} else {
  resultDiv.innerHTML = '<div class="alert alert-info">No status available for this case.</div>';
}
},
  error: function (xhr) {
  checkBtn.disabled = false;
  checkBtn.innerHTML = '<i class="bi bi-search me-2"></i>Check Status';
  const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error checking case status.';
  resultDiv.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
  console.error('Error checking case status:', xhr);
}
});
}

  // Search Bar Functionality (unchanged)
  const searchBar = document.querySelector(".search-bar");
  if (searchBar) {
  searchBar.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const lawyerCards = document.querySelectorAll('#lawyersList .card');

  lawyerCards.forEach(card => {
  const lawyerName = card.querySelector('.lawyer-name')?.textContent.toLowerCase() || '';
  const lawyerSpecialization = card.querySelector('.lawyer-specialization')?.textContent.toLowerCase() || '';

  if (lawyerName.includes(searchTerm) || lawyerSpecialization.includes(searchTerm)) {
  card.style.display = 'block';
} else {
  card.style.display = 'none';
}
});
});
}

  // Dashboard Functions (unchanged)
  function updateLiveTime() {
  const liveTimeElement = document.getElementById('live-time');

  function formatTime() {
  const now = new Date();
  const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};
  return now.toLocaleString('en-US', options);
}

  function updateDisplay() {
  liveTimeElement.textContent = formatTime();
}

  updateDisplay();
  setInterval(updateDisplay, 1000);
}

  function fetchTotalLawyersCount() {
  const totalLawyersElement = document.getElementById('total-lawyers');

  if (!token) {
  totalLawyersElement.textContent = 'N/A';
  return;
}

  $.ajax({
  url: 'http://localhost:8080/api/v1/user/total-lawyers-count',
  method: 'GET',
  headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
},
  success: function (data) {
  if (data.code === 200) {
  animateCountUp(totalLawyersElement, 0, data.data || 0, 1000);
} else {
  totalLawyersElement.textContent = 'Error';
  console.error('Failed to fetch lawyers count:', data.message);
}
},
  error: function (xhr) {
  totalLawyersElement.textContent = 'Error';
  console.error('Error fetching lawyers count:', xhr);
}
});
}

  function animateCountUp(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
  if (!startTimestamp) startTimestamp = timestamp;
  const progress = Math.min((timestamp - startTimestamp) / duration, 1);
  element.textContent = Math.floor(progress * (end - start) + start);
  if (progress < 1) {
  window.requestAnimationFrame(step);
}
};
  window.requestAnimationFrame(step);
}

  function refreshGoogleCalendar() {
  const calendarIframe = document.getElementById('google-calendar');
  if (calendarIframe) {
  calendarIframe.src = calendarIframe.src;
}
}

  function initializeDashboard() {
  if (!token) {
  window.location.href = 'login.html';
  return;
}
  updateLiveTime();
  fetchTotalLawyersCount();
  setInterval(refreshGoogleCalendar, 5 * 60 * 1000);
}

  function safeInitialize() {
  try {
  initializeDashboard();
} catch (error) {
  console.error('Dashboard initialization error:', error);
  const errorContainer = document.createElement('div');
  errorContainer.className = 'alert alert-danger';
  errorContainer.textContent = 'Unable to load dashboard. Please try again later.';
  document.getElementById('dashboard-section').prepend(errorContainer);
}
}

  // Case Submission Form Enhancements (unchanged)
  const form = document.getElementById('case-submit-form');
  const descriptionField = document.getElementById('caseDescription');
  const charCountDisplay = document.getElementById('charCount');
  const caseMessage = document.getElementById("case-message");

  function updateCharCount() {
  const maxLength = 500;
  const currentLength = descriptionField.value.length;
  charCountDisplay.textContent = `${currentLength}/${maxLength}`;
  if (currentLength > maxLength) {
  charCountDisplay.classList.add('text-danger');
  descriptionField.classList.add('is-invalid');
  descriptionField.setCustomValidity("Description exceeds maximum length.");
} else {
  charCountDisplay.classList.remove('text-danger');
  descriptionField.classList.remove('is-invalid');
  descriptionField.setCustomValidity("");
}
}

  updateCharCount();
  descriptionField.addEventListener('input', updateCharCount);

  form.addEventListener('reset', function () {
  caseMessage.classList.add('d-none');
  updateCharCount();
  form.classList.remove('was-validated');
});
});
