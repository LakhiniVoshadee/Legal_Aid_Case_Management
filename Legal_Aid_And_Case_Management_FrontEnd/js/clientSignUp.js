document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');
  let currentStep = 1;

  // Show/hide steps
  function updateFormView() {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${currentStep}`).classList.add('active');
  }

  // Clear previous validation feedback
  function clearFeedback() {
    document.querySelectorAll('.form-control').forEach(input => {
      input.classList.remove('is-invalid');
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
      }
    });
  }

  // Validate step
  function validateStep(step) {
    clearFeedback();
    let valid = true;
    const inputs = document.getElementById(`step${step}`).querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        input.classList.add('is-invalid');
        input.nextElementSibling.textContent = `${input.previousElementSibling.textContent} is required`;
        valid = false;
      }
    });

    if (step === 1) {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        document.getElementById('confirmPasswordFeedback').textContent = 'Passwords do not match';
        valid = false;
      }
    }

    return valid;
  }

  // Next button click
  nextBtn.addEventListener('click', function () {
    if (validateStep(1)) {
      currentStep = 2;
      updateFormView();
    }
  });

  // Previous button click
  prevBtn.addEventListener('click', function () {
    currentStep = 1;
    updateFormView();
  });

  // Form submission with AJAX
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (validateStep(2)) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';

      const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        name: document.getElementById('username').value,
        role: document.getElementById('role').value,
        full_name: document.getElementById('full_name').value,
        phone_number: document.getElementById('phone_number').value,
        date_of_birth: document.getElementById('date_of_birth').value,
        address: document.getElementById('address').value,
        preferred_language: document.getElementById('preferred_language').value,
        gender: document.getElementById('gender').value,
        NIC: document.getElementById('nic').value
      };

      try {
        const response = await fetch('http://localhost:8080/api/v1/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Registration successful:', result);
          const successModal = new bootstrap.Modal(document.getElementById('successModal'));
          successModal.show();
          form.reset();
          currentStep = 1;
          updateFormView();
        } else {
          console.error('Error:', result);
          if (result.status === 406) { // Not_Acceptable (Email already used)
            document.getElementById('email').classList.add('is-invalid');
            document.getElementById('emailFeedback').textContent = result.message;
          } else {
            alert('Registration failed: ' + result.message);
          }
        }
      } catch (err) {
        console.error('Request failed:', err);
        alert('Something went wrong. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Register';
      }
    }
  });
});
