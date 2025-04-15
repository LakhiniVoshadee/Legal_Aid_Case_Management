document.addEventListener("DOMContentLoaded", function () {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  let webSocket = null;
  let currentRecipientEmail = null;

  if (!token || !email) {
    window.location.href = "login.html";
    return;
  }

  if (email) {
    document.getElementById("welcomeMessage").textContent = `Welcome, ${email}!`;
    document.getElementById("lawyer-name").textContent = email;
  }

  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
  const contentSections = document.querySelectorAll(".content-section");
  const sectionTitle = document.getElementById("section-title");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      this.classList.add("active");
      const targetSectionId = this.getAttribute("data-section");
      contentSections.forEach((section) => section.classList.remove("active"));
      document.getElementById(targetSectionId).classList.add("active");
      sectionTitle.textContent = this.textContent.trim();

      if (targetSectionId === "case-section") {
        fetchOpenCases();
        document.getElementById("open-cases-tab").click();
      } else if (targetSectionId === "profile-section") {
        fetchLawyerProfile();
      } else if (targetSectionId === "clients-section") {
        fetchClients();
      } else if (targetSectionId === "messages-section") {
        initializeWebSocket();
        fetchContacts();
      }
    });
  });

  // Tab event listeners for case section
  document.getElementById("open-cases-tab").addEventListener("click", fetchOpenCases);
  document.getElementById("assigned-cases-tab").addEventListener("click", fetchAssignedCases);

  // Chat form submission
  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const chatInput = document.getElementById("chat-input");
      const content = chatInput.value.trim();
      if (content && currentRecipientEmail && webSocket) {
        const message = {
          senderEmail: email,
          recipientEmail: currentRecipientEmail,
          content: content,
          timestamp: new Date().toISOString()
        };
        try {
          webSocket.send(JSON.stringify(message));
          displayMessage(message, true);
          chatInput.value = "";
        } catch (error) {
          showChatError("Failed to send message. Please try again.");
        }
      }
    });
  }

  fetchLawyerProfile();

  const districtsByProvince = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    Eastern: ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    Uva: ["Badulla", "Monaragala"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"],
  };

  const provinceSelect = document.getElementById("province");
  const districtSelect = document.getElementById("district");

  provinceSelect.addEventListener("change", function () {
    const selectedProvince = this.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    if (selectedProvince && districtsByProvince[selectedProvince]) {
      districtsByProvince[selectedProvince].forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  });

  const profileForm = document.getElementById("profile-form");
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    updateLawyerProfile();
  });

  document.getElementById("logout-btn").addEventListener("click", function () {
    if (webSocket) {
      webSocket.close();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "login.html";
  });

  document.getElementById("confirm-deactivate-btn").addEventListener("click", function () {
    const confirmEmail = document.getElementById("deactivate-confirm-email").value;
    if (confirmEmail === email) {
      deactivateAccount();
    } else {
      alert("Email does not match your account email.");
    }
  });

  // Profile Picture Handling
  const profilePicInput = document.getElementById("profile-pic-input");
  const profilePic = document.getElementById("profile-pic");
  const deletePicBtn = document.getElementById("delete-pic-btn");
  const uploadSuccess = document.getElementById("upload-success");
  const uploadError = document.getElementById("upload-error");

  profilePicInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      if (!file.type.startsWith("image/")) {
        uploadError.textContent = "Please upload an image file (JPG, PNG, JPEG).";
        uploadError.classList.remove("d-none");
        setTimeout(() => uploadError.classList.add("d-none"), 3000);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        uploadError.textContent = "File size must be less than 5MB.";
        uploadError.classList.remove("d-none");
        setTimeout(() => uploadError.classList.add("d-none"), 3000);
        return;
      }
      uploadProfilePicture(file);
    }
  });

  deletePicBtn.addEventListener("click", function () {
    deleteProfilePicture();
  });

  // Case Review Form Handling
  const caseReviewForm = document.getElementById("case-review-form");
  if (caseReviewForm) {
    const caseIdSelect = document.getElementById("case-id-select");
    const caseDetails = document.getElementById("case-details");
    const clientName = document.getElementById("client-name");
    const reviewMessage = document.getElementById("review-message");

    caseIdSelect.addEventListener("change", function () {
      const selectedCaseId = this.value;
      if (selectedCaseId) {
        fetchCaseDetails(selectedCaseId);
      } else {
        caseDetails.value = "";
        clientName.value = "";
      }
    });

    caseReviewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const caseId = caseIdSelect.value;
      const action = e.submitter.dataset.action;
      if (caseId && action) {
        reviewCase(caseId, action);
      }
    });
  }

  function initializeWebSocket() {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      return;
    }

    webSocket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    webSocket.onopen = function () {
      console.log("WebSocket connected");
      document.getElementById("chat-error").classList.add("d-none");
    };

    webSocket.onmessage = function (event) {
      try {
        const message = JSON.parse(event.data);
        if (message.senderEmail === currentRecipientEmail || message.senderEmail === email) {
          displayMessage(message, message.senderEmail === email);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    webSocket.onerror = function (error) {
      console.error("WebSocket error:", error);
      showChatError("Failed to connect to chat server. Please try again later.");
    };

    webSocket.onclose = function (event) {
      console.log("WebSocket closed:", event);
      showChatError("Chat connection closed. Reconnecting...");
      setTimeout(initializeWebSocket, 5000);
    };
  }

  function fetchContacts() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML =
      '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading contacts...</p></div>';

    $.ajax({
      url: "http://localhost:8080/api/v1/lawyer/clients",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.code === 200 && response.data && response.data.length > 0) {
          displayContacts(response.data);
        } else {
          contactList.innerHTML = '<p class="text-muted">No clients found.</p>';
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching contacts:", error);
        contactList.innerHTML = '<div class="alert alert-danger">Failed to load contacts. Please try again later.</div>';
      },
    });
  }

  function displayContacts(clients) {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    clients.forEach((client) => {
      const contactItem = `
        <a href="#" class="list-group-item list-group-item-action" data-email="${client.email}">
          <div class="d-flex align-items-center">
            <img src="/api/placeholder/40/40" class="rounded-circle me-2" alt="${client.full_name}">
            <div>
              <strong>${client.full_name || "Unknown"}</strong>
              <p class="mb-0 text-muted small">${client.email}</p>
            </div>
          </div>
        </a>`;
      contactList.innerHTML += contactItem;
    });

    document.querySelectorAll("#contact-list .list-group-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll("#contact-list .list-group-item").forEach((i) => i.classList.remove("active"));
        this.classList.add("active");
        currentRecipientEmail = this.getAttribute("data-email");
        document.getElementById("chat-contact-name").textContent = this.querySelector("strong").textContent;
        document.getElementById("chat-contact-pic").src = this.querySelector("img").src;
        document.getElementById("no-chat-selected").classList.add("d-none");
        document.getElementById("chat-area").classList.remove("d-none");
        document.getElementById("chat-messages").innerHTML = "";
        document.getElementById("chat-error").classList.add("d-none");
        fetchMessages();
      });
    });
  }

  function fetchMessages() {
    if (!currentRecipientEmail) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/user/messages?senderEmail=${email}&recipientEmail=${currentRecipientEmail}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.code === 200 && response.data) {
          document.getElementById("chat-messages").innerHTML = "";
          response.data.forEach((message) => {
            displayMessage(message, message.senderEmail === email);
          });
          scrollChatToBottom();
        } else {
          showChatError("No messages found.");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching messages:", error);
        showChatError("Failed to load messages. Please try again.");
      },
    });
  }

  function displayMessage(message, isSent) {
    const chatMessages = document.getElementById("chat-messages");
    const timestamp = new Date(message.timestamp).toLocaleString();
    const messageHtml = `
      <div class="message ${isSent ? "sent" : "received"}">
        <p class="mb-1">${message.content}</p>
        <small>${timestamp}</small>
      </div>`;
    chatMessages.innerHTML += messageHtml;
    scrollChatToBottom();
  }

  function scrollChatToBottom() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showChatError(message) {
    const chatError = document.getElementById("chat-error");
    chatError.textContent = message;
    chatError.classList.remove("d-none");
    setTimeout(() => chatError.classList.add("d-none"), 5000);
  }

  function fetchLawyerProfile() {
    fetch("http://localhost:8080/api/v1/user/lawyer?email=" + email, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data) {
          populateProfileForm(data.data);
          if (data.data.profilePictureUrl) {
            profilePic.src = data.data.profilePictureUrl;
            deletePicBtn.classList.remove("d-none");
          } else {
            profilePic.src = "/api/placeholder/100/100";
            deletePicBtn.classList.add("d-none");
          }
          document.getElementById("header-profile-pic").src =
            data.data.profilePictureUrl || "/api/placeholder/36/36";
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }

  function populateProfileForm(data) {
    if (!data) return;
    document.getElementById("lawyer_name").value = data.lawyer_name || "";
    document.getElementById("contactNumber").value = data.contactNumber || "";
    document.getElementById("address").value = data.address || "";
    document.getElementById("specialization").value = data.specialization || "";
    document.getElementById("yearsOfExperience").value = data.yearsOfExperience || "";
    document.getElementById("barAssociationNumber").value = data.barAssociationNumber || "";
    document.getElementById("officeLocation").value = data.officeLocation || "";
    document.getElementById("bio").value = data.bio || "";
    document.getElementById("province").value = data.province || "";

    if (data.province) {
      const event = new Event("change");
      provinceSelect.dispatchEvent(event);
      setTimeout(() => {
        document.getElementById("district").value = data.district || "";
      }, 100);
    }
  }

  function updateLawyerProfile() {
    const updateBtn = document.getElementById("update-profile-btn");
    const successAlert = document.getElementById("update-success");
    const errorAlert = document.getElementById("update-error");

    successAlert.classList.add("d-none");
    errorAlert.classList.add("d-none");

    updateBtn.disabled = true;
    updateBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...';

    const lawyerUpdateDTO = {
      lawyer_name: document.getElementById("lawyer_name").value,
      contactNumber: document.getElementById("contactNumber").value,
      address: document.getElementById("address").value,
      specialization: document.getElementById("specialization").value,
      yearsOfExperience: document.getElementById("yearsOfExperience").value
        ? parseInt(document.getElementById("yearsOfExperience").value)
        : null,
      barAssociationNumber: document.getElementById("barAssociationNumber").value,
      officeLocation: document.getElementById("officeLocation").value,
      bio: document.getElementById("bio").value,
      province: document.getElementById("province").value,
      district: document.getElementById("district").value,
    };

    fetch("http://localhost:8080/api/v1/user/update-lawyer", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lawyerUpdateDTO),
    })
      .then((response) => response.json())
      .then((data) => {
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="bi bi-save me-1"></i> Update Profile';
        if (data.code === 200) {
          successAlert.classList.remove("d-none");
          setTimeout(() => {
            successAlert.classList.add("d-none");
          }, 3000);
        } else {
          errorAlert.textContent = data.message || "Error updating profile!";
          errorAlert.classList.remove("d-none");
        }
      })
      .catch((error) => {
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="bi bi-save me-1"></i> Update Profile';
        console.error("Error updating profile:", error);
        errorAlert.textContent = "Network error. Please try again.";
        errorAlert.classList.add("d-none");
      });
  }

  function uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("file", file);

    const uploadSuccess = document.getElementById("upload-success");
    const uploadError = document.getElementById("upload-error");

    uploadSuccess.classList.add("d-none");
    uploadError.classList.add("d-none");

    fetch(`http://localhost:8080/api/v1/user/${email}/profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }
        return response.json();
      })
      .then((data) => {
        profilePic.src = data.profilePictureUrl;
        document.getElementById("header-profile-pic").src = data.profilePictureUrl;
        deletePicBtn.classList.remove("d-none");
        uploadSuccess.classList.remove("d-none");
        setTimeout(() => uploadSuccess.classList.add("d-none"), 3000);
        profilePicInput.value = "";
      })
      .catch((error) => {
        console.error("Error uploading profile picture:", error);
        uploadError.textContent = "Error uploading profile picture. Please try again.";
        uploadError.classList.remove("d-none");
        setTimeout(() => uploadError.classList.add("d-none"), 3000);
      });
  }

  function deleteProfilePicture() {
    const uploadSuccess = document.getElementById("upload-success");
    const uploadError = document.getElementById("upload-error");

    uploadSuccess.classList.add("d-none");
    uploadError.classList.add("d-none");

    fetch(`http://localhost:8080/api/v1/user/${email}/profile-picture`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete profile picture");
        }
        profilePic.src = "/api/placeholder/100/100";
        document.getElementById("header-profile-pic").src = "/api/placeholder/36/36";
        deletePicBtn.classList.add("d-none");
        uploadSuccess.textContent = "Profile picture deleted successfully!";
        uploadSuccess.classList.remove("d-none");
        setTimeout(() => uploadSuccess.classList.add("d-none"), 3000);
      })
      .catch((error) => {
        console.error("Error deleting profile picture:", error);
        uploadError.textContent = "Error deleting profile picture. Please try again.";
        uploadError.classList.remove("d-none");
        setTimeout(() => uploadError.classList.add("d-none"), 3000);
      });
  }

  function deactivateAccount() {
    const deactivateBtn = document.getElementById("confirm-deactivate-btn");
    deactivateBtn.disabled = true;
    deactivateBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

    fetch("http://localhost:8080/api/v1/user/delete-account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        deactivateBtn.disabled = false;
        deactivateBtn.innerHTML = "Deactivate Account";
        if (data.code === 200) {
          if (webSocket) {
            webSocket.close();
          }
          alert("Account deleted successfully");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Error deleting account");
        }
      })
      .catch((error) => {
        deactivateBtn.disabled = false;
        deactivateBtn.innerHTML = "Deactivate Account";
        console.error("Error deleting account:", error);
        alert("Network error. Please try again.");
      });
  }

  function fetchOpenCases() {
    const caseList = document.getElementById("case-list");
    const caseMessage = document.getElementById("case-message");
    caseList.innerHTML =
      '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading cases...</p></div>';

    $.ajax({
      url: "http://localhost:8080/api/v1/case/open-cases",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.code === 200 && response.data) {
          displayCases(response.data, "case-list");
          if (caseReviewForm) populateCaseSelect(response.data);
        } else {
          caseList.innerHTML = '<p class="text-muted">No open cases found.</p>';
          caseMessage.innerHTML = "";
          if (caseReviewForm)
            document.getElementById("case-id-select").innerHTML =
              '<option value="">No open cases available</option>';
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching open cases:", error);
        caseList.innerHTML = '<div class="alert alert-danger">Failed to load cases. Please try again later.</div>';
        caseMessage.innerHTML = "";
        if (caseReviewForm)
          document.getElementById("case-id-select").innerHTML =
            '<option value="">Error loading cases</option>';
      },
    });
  }

  function fetchAssignedCases() {
    const assignedCaseList = document.getElementById("assigned-case-list");
    const assignedCaseMessage = document.getElementById("assigned-case-message");
    assignedCaseList.innerHTML =
      '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading assigned cases...</p></div>';

    $.ajax({
      url: "http://localhost:8080/api/v1/case/assigned",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.code === 200 && response.data) {
          displayAssignedCases(response.data, "assigned-case-list");
          assignedCaseMessage.innerHTML = "";
        } else {
          assignedCaseList.innerHTML = '<p class="text-muted">No assigned cases found.</p>';
          assignedCaseMessage.innerHTML = "";
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching assigned cases:", error);
        assignedCaseList.innerHTML =
          '<div class="alert alert-danger">Failed to load assigned cases. Please try again later.</div>';
        assignedCaseMessage.innerHTML = "";
      },
    });
  }

  function fetchClients() {
    const clientList = document.getElementById("client-list");
    const clientMessage = document.getElementById("client-message");
    clientList.innerHTML =
      '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading clients...</p></div>';

    $.ajax({
      url: "http://localhost:8080/api/v1/lawyer/clients",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.code === 200 && response.data && response.data.length > 0) {
          displayClients(response.data);
          document.getElementById("total-clients").textContent = response.data.length;
          clientMessage.innerHTML = "";
        } else {
          clientList.innerHTML = '<p class="text-muted">No clients found.</p>';
          document.getElementById("total-clients").textContent = "0";
          clientMessage.innerHTML = "";
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching clients:", error);
        if (xhr.status === 403) {
          alert("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "login.html";
        } else {
          clientList.innerHTML =
            '<div class="alert alert-danger">Failed to load clients. Please try again later.</div>';
          clientMessage.innerHTML = "";
        }
      },
    });
  }

  function displayCases(cases, listId) {
    const caseList = document.getElementById(listId);
    caseList.innerHTML = "";
    if (!cases.length) {
      caseList.innerHTML = '<p class="text-muted">No cases found.</p>';
      return;
    }

    cases.forEach((caseItem) => {
      const caseCard = `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Case #${caseItem.caseNumber}</h5>
              <p class="card-text">${caseItem.description}</p>
              <p><strong>Client:</strong> ${caseItem.clientName}</p>
              <p><strong>Status:</strong> ${caseItem.status}</p>
              <button class="btn btn-success me-2 accept-btn" data-case-id="${caseItem.caseId}" style="display: ${
        caseItem.status === "OPEN" ? "inline-block" : "none"
      };">Accept</button>
              <button class="btn btn-danger decline-btn" data-case-id="${caseItem.caseId}" style="display: ${
        caseItem.status === "OPEN" ? "inline-block" : "none"
      };">Decline</button>
            </div>
          </div>
        </div>`;
      caseList.innerHTML += caseCard;
    });

    document.querySelectorAll(`#${listId} .accept-btn`).forEach((btn) => {
      btn.addEventListener("click", function () {
        const caseId = this.getAttribute("data-case-id");
        reviewCase(caseId, "ACCEPTED");
      });
    });

    document.querySelectorAll(`#${listId} .decline-btn`).forEach((btn) => {
      btn.addEventListener("click", function () {
        const caseId = this.getAttribute("data-case-id");
        reviewCase(caseId, "DECLINED");
      });
    });
  }

  function displayAssignedCases(cases, listId) {
    const assignedCaseList = document.getElementById(listId);
    assignedCaseList.innerHTML = "";
    if (!cases.length) {
      assignedCaseList.innerHTML = '<p class="text-muted">No assigned cases found.</p>';
      return;
    }

    cases.forEach((caseItem) => {
      const caseCard = `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Case #${caseItem.caseNumber}</h5>
              <p class="card-text">${caseItem.description}</p>
              <p><strong>Client:</strong> ${caseItem.clientName}</p>
              <p><strong>Status:</strong> ${caseItem.status}</p>
            </div>
          </div>
        </div>`;
      assignedCaseList.innerHTML += caseCard;
    });
  }

  function displayClients(clients) {
    const clientList = document.getElementById("client-list");
    clientList.innerHTML = "";
    clients.forEach((client) => {
      const clientCard = `
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${client.full_name || "Unknown"}</h5>
              <p class="card-text"><strong>Email:</strong> ${client.email || "N/A"}</p>
              <p class="card-text"><strong>Phone:</strong> ${client.phone_number || "N/A"}</p>
              <p class="card-text"><strong>Address:</strong> ${client.address || "N/A"}</p>
              <p class="card-text"><strong>Language:</strong> ${client.preferred_language || "N/A"}</p>
              <p class="card-text"><strong>Gender:</strong> ${client.gender || "N/A"}</p>
            </div>
          </div>
        </div>`;
      clientList.innerHTML += clientCard;
    });
  }

  function reviewCase(caseId, status) {
    const messageDiv = document.getElementById("case-message");
    const reviewMessage = document.getElementById("review-message");

    $.ajax({
      url: "http://localhost:8080/api/v1/user/lawyer?email=" + email,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (profileResponse) {
        if (profileResponse.code === 200 && profileResponse.data) {
          const lawyerId = profileResponse.data.lawyer_id;

          $.ajax({
            url: `http://localhost:8080/api/v1/case/review/${caseId}?status=${status}&lawyerId=${lawyerId}`,
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            success: function (response) {
              if (response.code === 200) {
                messageDiv.innerHTML = `<div class="alert alert-success">Case ${status.toLowerCase()} successfully!</div>`;
                if (reviewMessage) {
                  reviewMessage.innerHTML = `<div class="alert alert-success">Case ${status.toLowerCase()} successfully!</div>`;
                }
                fetchOpenCases();
                fetchAssignedCases();
                fetchClients();
                fetchContacts(); // Refresh contacts after case status change
              } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">${response.message}</div>`;
                if (reviewMessage) {
                  reviewMessage.innerHTML = `<div class="alert alert-danger">${response.message}</div>`;
                }
              }
            },
            error: function (xhr, status, error) {
              console.error("Error reviewing case:", error);
              messageDiv.innerHTML =
                '<div class="alert alert-danger">Error reviewing case. Please try again.</div>';
              if (reviewMessage) {
                reviewMessage.innerHTML =
                  '<div class="alert alert-danger">Error reviewing case. Please try again.</div>';
              }
            },
          });
        } else {
          messageDiv.innerHTML =
            '<div class="alert alert-danger">Failed to fetch lawyer profile.</div>';
          if (reviewMessage) {
            reviewMessage.innerHTML =
              '<div class="alert alert-danger">Failed to fetch lawyer profile.</div>';
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching lawyer profile:", error);
        messageDiv.innerHTML =
          '<div class="alert alert-danger">Error fetching lawyer profile. Please try again.</div>';
        if (reviewMessage) {
          reviewMessage.innerHTML =
            '<div class="alert alert-danger">Error fetching lawyer profile. Please try again.</div>';
        }
      },
    });
  }

  function populateCaseSelect(cases) {
    const caseIdSelect = document.getElementById("case-id-select");
    caseIdSelect.innerHTML = '<option value="">Select a case</option>';
    cases.forEach((caseItem) => {
      const option = document.createElement("option");
      option.value = caseItem.caseId;
      option.textContent = `Case #${caseItem.caseNumber} - ${caseItem.clientName}`;
      caseIdSelect.appendChild(option);
    });
  }

  function fetchCaseDetails(caseId) {
    $.ajax({
      url: "http://localhost:8080/api/v1/case/open-cases",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.code === 200 && response.data) {
          const caseItem = response.data.find((c) => c.caseId == caseId);
          if (caseItem) {
            document.getElementById("case-details").value = caseItem.description;
            document.getElementById("client-name").value = caseItem.clientName;
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching case details:", error);
        document.getElementById("review-message").innerHTML =
          '<div class="alert alert-danger">Error loading case details.</div>';
      },
    });
  }
});
