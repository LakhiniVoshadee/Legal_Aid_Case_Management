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
    });
  });

  // Fetch and populate client profile
  fetchClientProfile();

  // Handle profile form submission
  document.getElementById("profile-form").addEventListener("submit", function (e) {
    e.preventDefault();
    updateClientProfile();
  });

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

  // Function to fetch lawyers
  function fetchLawyers() {
    fetch("http://localhost:8080/api/v1/user/lawyers", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => displayLawyers(data.data || []))
      .catch(error => console.error("Error fetching lawyers:", error));
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
        <div class="card">
          <h5>${lawyer.lawyer_name || "Unknown"}</h5>
          <p>${lawyer.specialization || "General Practice"}</p>
          <p>${lawyer.bio || "No bio available"}</p>
          <p>${lawyer.contactNumber || "N/A"}</p>
        </div>`;
      lawyersList.innerHTML += lawyerCard;
    });
  }

  fetchLawyers();
});
