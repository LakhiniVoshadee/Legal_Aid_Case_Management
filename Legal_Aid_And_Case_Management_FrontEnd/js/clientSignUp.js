document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');
  const currentStepText = document.getElementById('currentStep');
  const progressDots = document.querySelectorAll('.progress-dot');
  let currentStep = 1;

  // Update the visual representation of form steps
  function updateFormView() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');

    // Update progress indicator
    currentStepText.textContent = currentStep;

    // Update progress dots
    progressDots.forEach(dot => {
      const stepNum = parseInt(dot.getAttribute('data-step'));
      if (stepNum <= currentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Clear validation feedback
  function clearFeedback() {
    document.querySelectorAll('.form-control, .form-select').forEach(input => {
      input.classList.remove('is-invalid');
    });

    document.querySelectorAll('.invalid-feedback').forEach(feedback => {
      feedback.textContent = '';
    });
  }

  // Validate form step
  function validateStep(step) {
    clearFeedback();
    let valid = true;
    const inputs = document.getElementById(`step${step}`).querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        input.classList.add('is-invalid');
        const feedbackId = input.id + 'Feedback';
        const feedbackElement = document.getElementById(feedbackId);
        if (feedbackElement) {
          const labelText = input.previousElementSibling ? input.previousElementSibling.textContent : input.name;
          feedbackElement.textContent = `${labelText} is required`;
        }
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

  // Button event listeners
  nextBtn.addEventListener('click', function () {
    if (validateStep(1)) {
      currentStep = 2;
      updateFormView();
    }
  });

  prevBtn.addEventListener('click', function () {
    currentStep = 1;
    updateFormView();
  });

  // Form submission handler
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (validateStep(2)) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';

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
        // Add a timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('http://localhost:8080/api/v1/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

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
          if (result.status === 406) {
            document.getElementById('email').classList.add('is-invalid');
            document.getElementById('emailFeedback').textContent = result.message;
          } else {
            alert('Registration failed: ' + result.message);
          }
        }
      } catch (err) {
        console.error('Request failed:', err);

        if (err.name === 'AbortError') {
          alert('Request timed out. Please check if the server is running.');
        } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          alert('Cannot connect to the server. Please check if the server is running at http://localhost:8080.');
        } else {
          alert('Something went wrong. Please try again.');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign up';
      }
    }
  });
});
