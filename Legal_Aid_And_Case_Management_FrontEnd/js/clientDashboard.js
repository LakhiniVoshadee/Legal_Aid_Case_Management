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

      // Fetch lawyers when "Find Lawyers" section is selected
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


  // Add more provinces and districts as needed
  };

  const provinceSelect = document.getElementById("provinceSelect");
  const districtSelect = document.getElementById("districtSelect");
  const filterBtn = document.getElementById("filterBtn");

  // Populate districts based on selected province
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

  // Filter lawyers when the filter button is clicked
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

  // Function to fetch client profile
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

  // Function to populate profile form
  function populateProfileForm(data) {
    document.getElementById("lawyer_name").value = data.full_name || "";
    document.getElementById("contactNumber").value = data.phone_number || "";
    document.getElementById("address").value = data.address || "";
    document.getElementById("gender").value = data.gender || "";
  }

  // Function to update client profile
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

  // Function to deactivate account
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

  // Function to fetch lawyers with optional province and district filters
  function fetchLawyers(province = null, district = null) {
    const lawyersList = document.getElementById("lawyersList");
    const errorAlert = document.getElementById("errorAlert");
    errorAlert.classList.add("d-none");

    // Show loading spinner
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

  // Function to display lawyers
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
                  <p class="lawyer-specialization">
                    ${lawyer.specialization || "General Practice"}
                  </p>
                </div>
              </div>
              <p class="card-text mb-3">
                <i class="bi bi-text-paragraph me-2"></i>
                ${truncateBio(lawyer.bio) || "No bio available"}
              </p>
              <div class="lawyer-stats">
                <div class="stat-item">
                  <div class="stat-value">
                    <i class="bi bi-telephone-fill"></i>
                  </div>
                  <div class="stat-label">
                    ${lawyer.contactNumber || "N/A"}
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div class="stat-label">
                    ${lawyer.district}, ${lawyer.province}
                  </div>
                </div>
              </div>
              <button onclick="viewFullProfile(${JSON.stringify(lawyer).replace(/"/g, '&quot;')})"
                      class="btn view-profile-btn mt-3">
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

  // Function to view full profile by email
  function viewFullProfile(lawyer) {
    const lawyerProfileURL = `lawyerProfiles.html?email=${encodeURIComponent(lawyer.email)}`;
    window.location.href = lawyerProfileURL;
  }

  // Moved search functionality inside the main DOMContentLoaded event listener
  // Add search functionality
  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.placeholder = 'Search lawyers...';
  searchBar.classList.add('form-control', 'search-bar');

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-bar-container');
  searchContainer.appendChild(searchBar);

  // Search icon
  const searchIcon = document.createElement('i');
  searchIcon.classList.add('bi', 'bi-search', 'search-icon');
  searchContainer.appendChild(searchIcon);

  // Insert search bar before the filter section
  const filterSection = document.querySelector('.filter-section');
  if (filterSection) {
    filterSection.parentNode.insertBefore(searchContainer, filterSection);
  }

  // Search functionality
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
});
