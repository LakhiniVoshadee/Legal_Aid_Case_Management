document.addEventListener("DOMContentLoaded", function () {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  if (!token || !email) {
    window.location.href = "login.html";
    return;
  }

  if (email) {
    document.getElementById("welcomeMessage").textContent = `Welcome, ${email}!`;
    document.getElementById("lawyer-name").textContent = email;
  }

  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const contentSections = document.querySelectorAll('.content-section');
  const sectionTitle = document.getElementById('section-title');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');
      const targetSectionId = this.getAttribute('data-section');
      contentSections.forEach(section => section.classList.remove('active'));
      document.getElementById(targetSectionId).classList.add('active');
      sectionTitle.textContent = this.textContent.trim();

      if (targetSectionId === "case-section") {
        fetchOpenCases();
      }
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

  const provinceSelect = document.getElementById('province');
  const districtSelect = document.getElementById('district');

  provinceSelect.addEventListener('change', function() {
    const selectedProvince = this.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    if (selectedProvince && districtsByProvince[selectedProvince]) {
      districtsByProvince[selectedProvince].forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  });

  const profileForm = document.getElementById('profile-form');
  profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    updateLawyerProfile();
  });

  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = 'login.html';
  });

  document.getElementById('confirm-deactivate-btn').addEventListener('click', function() {
    const confirmEmail = document.getElementById('deactivate-confirm-email').value;
    if (confirmEmail === email) {
      deactivateAccount();
    } else {
      alert('Email does not match your account email.');
    }
  });

  // Case Review Form Handling (if applicable)
  const caseReviewForm = document.getElementById('case-review-form');
  if (caseReviewForm) {
    const caseIdSelect = document.getElementById('case-id-select');
    const caseDetails = document.getElementById('case-details');
    const clientName = document.getElementById('client-name');
    const reviewMessage = document.getElementById('review-message');

    caseIdSelect.addEventListener('change', function() {
      const selectedCaseId = this.value;
      if (selectedCaseId) {
        fetchCaseDetails(selectedCaseId);
      } else {
        caseDetails.value = '';
        clientName.value = '';
      }
    });

    caseReviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const caseId = caseIdSelect.value;
      const action = e.submitter.dataset.action;
      if (caseId && action) {
        reviewCase(caseId, action);
      }
    });
  }

  function fetchLawyerProfile() {
    fetch('http://localhost:8080/api/v1/user/lawyer?email=' + email, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 200 && data.data) {
          populateProfileForm(data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }

  function populateProfileForm(data) {
    if (!data) return;
    document.getElementById('lawyer_name').value = data.lawyer_name || '';
    document.getElementById('contactNumber').value = data.contactNumber || '';
    document.getElementById('address').value = data.address || '';
    document.getElementById('specialization').value = data.specialization || '';
    document.getElementById('yearsOfExperience').value = data.yearsOfExperience || '';
    document.getElementById('barAssociationNumber').value = data.barAssociationNumber || '';
    document.getElementById('officeLocation').value = data.officeLocation || '';
    document.getElementById('bio').value = data.bio || '';
    document.getElementById('province').value = data.province || '';

    if (data.province) {
      const event = new Event('change');
      provinceSelect.dispatchEvent(event);
      setTimeout(() => {
        document.getElementById('district').value = data.district || '';
      }, 100);
    }
  }

  function updateLawyerProfile() {
    const updateBtn = document.getElementById('update-profile-btn');
    const successAlert = document.getElementById('update-success');
    const errorAlert = document.getElementById('update-error');

    successAlert.classList.add('d-none');
    errorAlert.classList.add('d-none');

    updateBtn.disabled = true;
    updateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...';

    const lawyerUpdateDTO = {
      lawyer_name: document.getElementById('lawyer_name').value,
      contactNumber: document.getElementById('contactNumber').value,
      address: document.getElementById('address').value,
      specialization: document.getElementById('specialization').value,
      yearsOfExperience: document.getElementById('yearsOfExperience').value ?
        parseInt(document.getElementById('yearsOfExperience').value) : null,
      barAssociationNumber: document.getElementById('barAssociationNumber').value,
      officeLocation: document.getElementById('officeLocation').value,
      bio: document.getElementById('bio').value,
      province: document.getElementById('province').value,
      district: document.getElementById('district').value
    };

    fetch('http://localhost:8080/api/v1/user/update-lawyer', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lawyerUpdateDTO)
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
    const deactivateBtn = document.getElementById('confirm-deactivate-btn');
    deactivateBtn.disabled = true;
    deactivateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

    fetch('http://localhost:8080/api/v1/user/delete-account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email })
    })
      .then(response => response.json())
      .then(data => {
        deactivateBtn.disabled = false;
        deactivateBtn.innerHTML = 'Deactivate Account';
        if (data.code === 200) {
          alert('Account deleted successfully');
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          window.location.href = 'login.html';
        } else {
          alert(data.message || 'Error deleting account');
        }
      })
      .catch(error => {
        deactivateBtn.disabled = false;
        deactivateBtn.innerHTML = 'Deactivate Account';
        console.error('Error deleting account:', error);
        alert('Network error. Please try again.');
      });
  }

  // Fetch open cases
  function fetchOpenCases() {
    const caseList = document.getElementById('case-list');
    caseList.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Loading cases...</p></div>';

    $.ajax({
      url: 'http://localhost:8080/api/v1/case/open-cases',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function(response) {
        if (response.code === 200 && response.data) {
          displayCases(response.data);
          if (caseReviewForm) populateCaseSelect(response.data); // Populate dropdown if form exists
        } else {
          caseList.innerHTML = '<p>No open cases found.</p>';
          if (caseReviewForm) document.getElementById('case-id-select').innerHTML = '<option value="">No open cases available</option>';
        }
      },
      error: function(xhr, status, error) {
        console.error('Error fetching cases:', error);
        caseList.innerHTML = '<div class="alert alert-danger">Failed to load cases. Please try again later.</div>';
        if (caseReviewForm) document.getElementById('case-id-select').innerHTML = '<option value="">Error loading cases</option>';
      }
    });
  }

  function displayCases(cases) {
    const caseList = document.getElementById('case-list');
    caseList.innerHTML = '';
    if (!cases.length) {
      caseList.innerHTML = '<p>No open cases found.</p>';
      return;
    }

    cases.forEach(caseItem => {
      const caseCard = `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Case #${caseItem.caseNumber}</h5>
              <p class="card-text">${caseItem.description}</p>
              <p><strong>Client:</strong> ${caseItem.clientName}</p>
              <p><strong>Status:</strong> ${caseItem.status}</p>
              <button class="btn btn-success me-2 accept-btn" data-case-id="${caseItem.caseId}">Accept</button>
              <button class="btn btn-danger decline-btn" data-case-id="${caseItem.caseId}">Decline</button>
            </div>
          </div>
        </div>`;
      caseList.innerHTML += caseCard;
    });

    // Attach event listeners to the buttons
    document.querySelectorAll('.accept-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const caseId = this.getAttribute('data-case-id');
        reviewCase(caseId, 'ACCEPTED');
      });
    });

    document.querySelectorAll('.decline-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const caseId = this.getAttribute('data-case-id');
        reviewCase(caseId, 'DECLINED');
      });
    });
  }

  function reviewCase(caseId, status) {
    const messageDiv = document.getElementById('case-message');
    const lawyerId = 1; // Replace with actual lawyer ID from authentication

    $.ajax({
      url: `http://localhost:8080/api/v1/case/review/${caseId}?status=${status}&lawyerId=${lawyerId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function(response) {
        if (response.code === 200) {
          messageDiv.innerHTML = `<div class="alert alert-success">Case ${status.toLowerCase()} successfully!</div>`;
          fetchOpenCases(); // Refresh the case list
        } else {
          messageDiv.innerHTML = `<div class="alert alert-danger">${response.message}</div>`;
        }
      },
      error: function(xhr, status, error) {
        console.error('Error reviewing case:', error);
        messageDiv.innerHTML = '<div class="alert alert-danger">Error reviewing case. Please try again.</div>';
      }
    });
  }

  // Additional functions for Case Review Form (if present)
  function populateCaseSelect(cases) {
    const caseIdSelect = document.getElementById('case-id-select');
    caseIdSelect.innerHTML = '<option value="">Select a case</option>';
    cases.forEach(caseItem => {
      const option = document.createElement('option');
      option.value = caseItem.caseId;
      option.textContent = `Case #${caseItem.caseNumber} - ${caseItem.clientName}`;
      caseIdSelect.appendChild(option);
    });
  }

  function fetchCaseDetails(caseId) {
    $.ajax({
      url: 'http://localhost:8080/api/v1/case/open-cases',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: function(response) {
        if (response.code === 200 && response.data) {
          const caseItem = response.data.find(c => c.caseId == caseId);
          if (caseItem) {
            document.getElementById('case-details').value = caseItem.description;
            document.getElementById('client-name').value = caseItem.clientName;
          }
        }
      },
      error: function(xhr, status, error) {
        console.error('Error fetching case details:', error);
        document.getElementById('review-message').innerHTML = '<div class="alert alert-danger">Error loading case details.</div>';
      }
    });
  }
});
