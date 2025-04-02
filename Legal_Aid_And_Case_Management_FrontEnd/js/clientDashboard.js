document.addEventListener("DOMContentLoaded", function () {
  // Load user data
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  if (!token || !email) {
    window.location.href = "login.html";
    return;
  }

  // Set welcome message
  document.getElementById("welcomeMessage").textContent = `Welcome, ${email}!`;
  document.getElementById("lawyer-name").textContent = email;

  // Navigation functionality
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
      }
    });
  });

  // Fetch and populate client profile
  fetchClientProfile();

  // Handle profile form submission
  document.getElementById("profile-form").addEventListener("submit", function (e) {
    e.preventDefault();
    updateClientProfile();
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

  // District options by province
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

  function fetchClientProfile() {
    fetch(`http://localhost:8080/api/v1/user/client?email=${email}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200 && data.data) {
          populateProfileForm(data.data);
        } else {
          console.error("Error fetching client profile:", data.message);
        }
      })
      .catch(error => {
        console.error("Error fetching client profile:", error);
      });
  }

  function populateProfileForm(data) {
    document.getElementById("lawyer_name").value = data.full_name || "";
    document.getElementById("contactNumber").value = data.phone_number || "";
    document.getElementById("address").value = data.address || "";
    document.getElementById("gender").value = data.gender || "";
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

    fetch('http://localhost:8080/api/v1/user/update-client', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientUpdateDTO)
    })
      .then(response => response.json())
      .then(data => {
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="bi bi-save me-1"></i> Update Profile';

        if (data.code === 200) {
          successAlert.classList.remove('d-none');
          setTimeout(() => {
            successAlert.classList.add('d-none');
          }, 3000);
        } else {
          errorAlert.textContent = data.message || 'Error updating profile!';
          errorAlert.classList.remove('d-none');
        }
      })
      .catch(error => {
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="bi bi-save me-1"></i> Update Profile';
        console.error('Error updating profile:', error);
        errorAlert.textContent = 'Network error. Please try again.';
        errorAlert.classList.remove('d-none');
      });
  }

  function deactivateAccount() {
    fetch("http://localhost:8080/api/v1/user/delete-client-account", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          alert("Account deleted successfully");
          localStorage.clear();
          window.location.href = "login.html";
        } else {
          alert(data.message || "Error deleting account");
        }
      })
      .catch(error => {
        console.error("Error deleting account:", error);
        alert("Network error. Please try again.");
      });
  }

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
      lawyersList.innerHTML = "<p>No lawyers found.</p>";
      return;
    }
    lawyers.forEach(lawyer => {
      const lawyerCard = `
        <div class="col-md-4 mb-3">
          <div class="card lawyer-card h-100">
            <div class="card-body d-flex flex-column">
              <div class="lawyer-profile-header">
                <div class="lawyer-avatar">
                  <i class="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h5 class="lawyer-name">${lawyer.lawyer_name || "Unknown"}</h5>
                  <p class="lawyer-specialization">${lawyer.specialization || "General Practice"}</p>
                </div>
              </div>
              <p class="card-text mb-3">
                <i class="bi bi-text-paragraph me-2"></i>
                ${truncateBio(lawyer.bio) || "No bio available"}
              </p>
              <div class="lawyer-stats">
                <div class="stat-item">
                  <div class="stat-value"><i class="bi bi-telephone-fill"></i></div>
                  <div class="stat-label">${lawyer.contactNumber || "N/A"}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value"><i class="bi bi-geo-alt-fill"></i></div>
                  <div class="stat-label">${lawyer.district}, ${lawyer.province}</div>
                </div>
              </div>
              <button onclick="viewFullProfile(${JSON.stringify(lawyer).replace(/"/g, '"')})" class="btn view-profile-btn mt-3">
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

  function viewFullProfile(lawyer) {
    const lawyerProfileURL = `lawyerProfiles.html?email=${encodeURIComponent(lawyer.email)}`;
    window.location.href = lawyerProfileURL;
  }

  // Case Submission Function
  function submitCase() {
    const description = document.getElementById("caseDescription").value;
    const submitBtn = document.getElementById("submit-case-btn");
    const messageDiv = document.getElementById("case-message");

    // Generate a simple unique case number
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
          messageDiv.innerHTML = '<div class="alert alert-success">Case submitted successfully! Case Number: ' + response.data.caseNumber + '</div>';
          document.getElementById("case-submit-form").reset();
        } else {
          messageDiv.innerHTML = '<div class="alert alert-danger">' + response.message + '</div>';
        }
      },
      error: function (xhr, status, error) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Case';
        messageDiv.innerHTML = '<div class="alert alert-danger">Error submitting case: ' + error + '</div>';
      }
    });
  }

  // Check Case Status Function
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
        checkBtn.innerHTML = 'Check Status';
        if (response.code === 200 && response.data) {
          const caseData = response.data;
          resultDiv.innerHTML = `
            <div class="status-card">
              <h5>Case Status: ${caseData.status}</h5>
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
        checkBtn.innerHTML = 'Check Status';
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error checking case status.';
        resultDiv.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
        console.error('Error checking case status:', xhr);
      }
    });
  }

  // Search Bar Functionality
  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.placeholder = 'Search lawyers...';
  searchBar.classList.add('form-control', 'search-bar');

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-bar-container');
  searchContainer.appendChild(searchBar);

  const searchIcon = document.createElement('i');
  searchIcon.classList.add('bi', 'bi-search', 'search-icon');
  searchContainer.appendChild(searchIcon);

  const filterSection = document.querySelector('.filter-section');
  if (filterSection) {
    filterSection.parentNode.insertBefore(searchContainer, filterSection);
  }

  searchBar.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const lawyerCards = document.querySelectorAll('#lawyersList .card');

    lawyerCards.forEach(card => {
      const lawyerName = card.querySelector('.lawyer-name').textContent.toLowerCase();
      const lawyerSpecialization = card.querySelector('.lawyer-specialization').textContent.toLowerCase();

      if (lawyerName.includes(searchTerm) || lawyerSpecialization.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Dashboard Functions
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

    fetch('http://localhost:8080/api/v1/user/total-lawyers-count', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          animateCountUp(totalLawyersElement, 0, data.data || 0, 1000);
        } else {
          totalLawyersElement.textContent = 'Error';
          console.error('Failed to fetch lawyers count:', data.message);
        }
      })
      .catch(error => {
        totalLawyersElement.textContent = 'Error';
        console.error('Error fetching lawyers count:', error);
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
    calendarIframe.src = calendarIframe.src;
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

  safeInitialize();

  // Case Submission Form Enhancements
  const form = document.getElementById('case-submit-form');
  const descriptionField = document.getElementById('caseDescription');
  const charCountDisplay = document.getElementById('charCount');
  const caseMessage = document.getElementById("case-message");
  const successMessage = document.getElementById("success-message");
  const caseIdDisplay = document.getElementById("case-id");
  const submitButton = document.getElementById("submit-case-btn");
  const priorityCheck = document.getElementById("priorityCheck");

  if (descriptionField && charCountDisplay) {
    descriptionField.addEventListener('input', function() {
      const charCount = this.value.length;
      charCountDisplay.textContent = charCount;

      if (charCount > 450) {
        charCountDisplay.classList.add('text-warning');
        charCountDisplay.classList.remove('text-danger');
      } else if (charCount > 500) {
        charCountDisplay.classList.add('text-danger');
        charCountDisplay.classList.remove('text-warning');
      } else {
        charCountDisplay.classList.remove('text-warning', 'text-danger');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        shakeInvalidFields();
        return;
      }

      submitCase();
    });
  }

  const fileInput = document.getElementById('fileAttachment');
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const files = this.files;
      let valid = true;

      if (files.length > 3) {
        alert('You can only upload up to 3 files.');
        valid = false;
      }

      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
          alert('File ' + files[i].name + ' exceeds the 5MB size limit.');
          valid = false;
          break;
        }
      }

      if (!valid) {
        this.value = '';
      }
    });
  }

  const categorySelect = document.getElementById('caseCategory');
  if (categorySelect) {
    categorySelect.addEventListener('change', function() {
      const selectedCategory = this.value;

      if (selectedCategory === 'billing') {
        const tooltip = document.createElement('div');
        tooltip.className = 'alert alert-info mt-2';
        tooltip.innerHTML = '<i class="fas fa-info-circle me-2"></i>For billing questions, please include your account or invoice number for faster assistance.';

        const existingTooltip = this.parentNode.querySelector('.alert');
        if (existingTooltip) {
          existingTooltip.remove();
        }

        this.parentNode.appendChild(tooltip);

        setTimeout(() => {
          tooltip.remove();
        }, 5000);
      }
    });
  }

  function shakeInvalidFields() {
    const invalidFields = form.querySelectorAll(':invalid');

    invalidFields.forEach(field => {
      field.classList.add('shake-animation');

      setTimeout(() => {
        field.classList.remove('shake-animation');
      }, 500);

      if (field === invalidFields[0]) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake-animation {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(style);
});
