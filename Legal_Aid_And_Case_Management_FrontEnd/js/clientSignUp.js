document.getElementById('clientRegistrationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Collect form data
  const formData = {
    email: document.getElementById('email').value,
    name: document.getElementById('name').value,
    password: document.getElementById('password').value,
    role: 'CLIENT',
    full_name: document.getElementById('fullName').value,
    phone_number: document.getElementById('phoneNumber').value,
    date_of_birth: document.getElementById('dateOfBirth').value || null,
    preferred_language: document.getElementById('preferredLanguage').value || null,
    gender: document.getElementById('gender').value || null,
    NIC: document.getElementById('nic').value || null,
    address: document.getElementById('address').value || null
  };

  // Here you would typically send the data to your backend API
  console.log('Form submitted with data:', formData);

  // For demonstration purposes, show a success message
  alert('Registration submitted successfully!');
});
