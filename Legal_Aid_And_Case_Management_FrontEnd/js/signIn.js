// Sign In Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Toggle password visibility
  const togglePassword = document.querySelector('.toggle-password');
  const passwordField = document.querySelector('#password');

  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', function() {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);

      // Toggle eye icon
      const eyeIcon = this.querySelector('i');
      eyeIcon.classList.toggle('fa-eye');
      eyeIcon.classList.toggle('fa-eye-slash');
    });
  }

  // Form validation
  const signInForm = document.getElementById('signInForm');

  if (signInForm) {
    signInForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Basic validation
      if (!email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
      }

      // Email validation
      if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
      }

      // Submit form - in a real app, you would send this to your server
      console.log('Form submitted', { email, password });
      showAlert('Signing in...', 'success');

      // Simulate redirect after success
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }

  // Helper function to validate email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Helper function to show alerts
  function showAlert(message, type) {
    // Check if alert container exists, if not create it
    let alertContainer = document.querySelector('.alert-container');

    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.className = 'alert-container';
      signInForm.insertAdjacentElement('beforebegin', alertContainer);
    }

    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} mt-3`;
    alert.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    alert.appendChild(closeBtn);

    // Add to container
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      alert.classList.add('fade');
      setTimeout(() => {
        alertContainer.removeChild(alert);
      }, 500);
    }, 3000);
  }

  // Add smooth animation on page load
  const signInCard = document.querySelector('.sign-in-card');
  if (signInCard) {
    signInCard.style.opacity = 0;
    signInCard.style.transform = 'translateY(20px)';

    setTimeout(() => {
      signInCard.style.transition = 'all 0.5s ease';
      signInCard.style.opacity = 1;
      signInCard.style.transform = 'translateY(0)';
    }, 200);
  }
});
