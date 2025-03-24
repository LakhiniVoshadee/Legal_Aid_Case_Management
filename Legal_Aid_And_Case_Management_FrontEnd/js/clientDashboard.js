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

  fetchLawyerProfile();

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

  const provinceSelect = document.getElementById("province");
  const districtSelect = document.getElementById("district");

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

  document.getElementById("logout-btn").addEventListener("click", function () {
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

  function fetchLawyerProfile() {
    setTimeout(() => {
      populateProfileForm({
        lawyer_name: "John Doe",
        contactNumber: "0771234567",
        address: "123 Main St, Colombo 05",
        specialization: "Family Law",
        yearsOfExperience: 8,
        barAssociationNumber: "BAR12345",
        officeLocation: "Law Chambers, Hulftsdorp",
        bio: "Experienced family lawyer with expertise in divorce, child custody, and property settlements.",
        province: "Western",
        district: "Colombo"
      });
    }, 500);
  }

  function populateProfileForm(data) {
    if (!data) return;
    Object.keys(data).forEach(key => {
      const field = document.getElementById(key);
      if (field) field.value = data[key] || "";
    });
    provinceSelect.dispatchEvent(new Event("change"));
    setTimeout(() => {
      districtSelect.value = data.district || "";
    }, 100);
  }

  function deactivateAccount() {
    fetch("http://localhost:8080/api/v1/user/delete-client", {
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

  function fetchLawyers() {
    fetch("http://localhost:8080/api/v1/user/lawyers", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => displayLawyers(data.data || []))
      .catch(error => console.error("Error fetching lawyers:", error));
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
