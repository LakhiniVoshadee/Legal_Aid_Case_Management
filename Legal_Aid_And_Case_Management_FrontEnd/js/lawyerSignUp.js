document.addEventListener('DOMContentLoaded', function () {

  const steps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const progressBar = document.querySelector('.progress-bar');
  const form = document.getElementById('lawyerSignupForm');

  let currentStep = 0;
  updateFormView();

  nextButtons.forEach(button => {
    button.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        currentStep++;
        updateFormView();
      }
    });
  });

  prevButtons.forEach(button => {
    button.addEventListener('click', function () {
      currentStep--;
      updateFormView();
    });
  });

  function updateFormView() {
    steps.forEach((step, index) => {
      step.classList.remove('active');
      if (index === currentStep) {
        step.classList.add('active');
      }
    });

    const progressPercentage = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `Step ${currentStep + 1}/${steps.length}`;
  }

  function validateStep(stepIndex) {
    const currentStepElement = steps[stepIndex];
    const inputFields = currentStepElement.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputFields.forEach(field => {
      field.classList.remove('is-invalid');
      const feedbackElement = field.nextElementSibling?.classList.contains('invalid-feedback')
        ? field.nextElementSibling
        : null;
      if (feedbackElement) {
        feedbackElement.remove();
      }

      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        field.classList.add('is-invalid');

        const feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        feedback.textContent = 'This field is required';
        field.parentNode.appendChild(feedback);
      }
    });

    return isValid;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (validateStep(currentStep)) {
      const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        fullName: document.getElementById('lawyer_name').value,
        contactNumber: document.getElementById('contactNumber').value,
        barAssociationNumber: document.getElementById('barAssociationNumber').value,
        yearsOfExperience: parseInt(document.getElementById('yearsOfExperience').value),
        address: document.getElementById('address').value,
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        officeLocation: document.getElementById('officeLocation').value,
        specialization: document.getElementById('specialization').value,
        bio: document.getElementById('bio').value,
      };

      try {
        const response = await fetch('http://localhost:8080/api/v1/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Registration successful:', result);
          const successModal = new bootstrap.Modal(document.getElementById('successModal'));
          successModal.show();
          form.reset();
          currentStep = 0;
          updateFormView();
        } else {
          const error = await response.json();
          console.error('Error:', error);
          alert('Registration failed: ' + error.message);
        }
      } catch (err) {
        console.error('Request failed:', err);
        alert('Something went wrong. Please try again.');
      }
    }
  });

  // Province & District dependency
  const provinceSelect = document.getElementById('province');
  const districtSelect = document.getElementById('district');
  const districtsByProvince = {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'Eastern': ['Batticaloa', 'Ampara', 'Trincomalee'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle']
  };

  provinceSelect.addEventListener('change', function () {
    const selectedProvince = this.value;
    const districts = districtsByProvince[selectedProvince] || [];

    districtSelect.innerHTML = '<option value="" selected disabled>Select District</option>';
    districts.forEach(district => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });
    districtSelect.disabled = districts.length === 0;
  });


  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.addEventListener('hidden.bs.modal', function () {
      console.log('Redirecting to login page...');
      // window.location.href = 'login.html';
    });
  }
});
