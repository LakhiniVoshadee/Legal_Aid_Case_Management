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

  // Logout functionality
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


  function fetchLawyerProfile() {
    // This would normally come from an API but we'll simulate it for now
    // In a real application, you would fetch this data from your backend

    // Show loading state or spinner here if needed

    // For testing purposes, we'll populate with sample data
    // In production, replace this with an API call to get the lawyer's profile
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

    // In a real application, use fetch or AJAX to get data from your API
    /*
    fetch('http://localhost:8080/api/v1/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    })
    .then(data => {
      if (data.code === 200) {
        populateProfileForm(data.data);
      }
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
    });
    */
  }

  // Function to populate form with lawyer data
  function populateProfileForm(data) {
    if (!data) return;

    // Set form values
    document.getElementById('lawyer_name').value = data.lawyer_name || '';
    document.getElementById('contactNumber').value = data.contactNumber || '';
    document.getElementById('address').value = data.address || '';
    document.getElementById('specialization').value = data.specialization || '';
    document.getElementById('yearsOfExperience').value = data.yearsOfExperience || '';
    document.getElementById('barAssociationNumber').value = data.barAssociationNumber || '';
    document.getElementById('officeLocation').value = data.officeLocation || '';
    document.getElementById('bio').value = data.bio || '';
    document.getElementById('province').value = data.province || '';

    // Trigger province change to load districts
    if (data.province) {
      const event = new Event('change');
      provinceSelect.dispatchEvent(event);

      // Set district after districts are loaded
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
        // Re-enable button
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="bi bi-save me-1"></i> Update Profile';

        if (data.code === 200) {
          // Show success message
          successAlert.classList.remove('d-none');
          setTimeout(() => {
            successAlert.classList.add('d-none');
          }, 3000);
        } else {
          // Show error message
          errorAlert.textContent = data.message || 'Error updating profile!';
          errorAlert.classList.remove('d-none');
        }
      })
      .catch(error => {
        // Re-enable button
        updateBtn.disabled = false;
        updateBtn.innerHTML = '<i class="bi bi-save me-1"></i> Update Profile';

        // Show error message
        console.error('Error updating profile:', error);
        errorAlert.textContent = 'Network error. Please try again.';
        errorAlert.classList.remove('d-none');
      });
  }

  // Function to deactivate account
  function deactivateAccount() {
    const deactivateBtn = document.getElementById('confirm-deactivate-btn');

    // Disable button and show loading state
    deactivateBtn.disabled = true;
    deactivateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

    // AJAX request to delete account
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
        // Re-enable button
        deactivateBtn.disabled = false;
        deactivateBtn.innerHTML = 'Deactivate Account';

        if (data.code === 200) {
          // Show success message and redirect to login
          alert('Account deleted successfully');
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          window.location.href = 'login.html';
        } else {
          // Show error message
          alert(data.message || 'Error deleting account');
        }
      })
      .catch(error => {
        // Re-enable button
        deactivateBtn.disabled = false;
        deactivateBtn.innerHTML = 'Deactivate Account';

        // Show error message
        console.error('Error deleting account:', error);
        alert('Network error. Please try again.');
      });
  }
});
