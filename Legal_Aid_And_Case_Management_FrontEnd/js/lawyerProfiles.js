document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const lawyerId = urlParams.get("lawyerId");

  if (!lawyerId) {
    alert("Invalid lawyer profile");
    window.location.href = "index.html"; // Redirect to home if no ID found
    return;
  }

  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/api/v1/user/lawyer/${lawyerId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        displayLawyerProfile(data.data);
      } else {
        alert("Error fetching lawyer details");
      }
    })
    .catch(error => console.error("Error fetching lawyer profile:", error));

  function displayLawyerProfile(lawyer) {
    document.getElementById("lawyer-name").textContent = lawyer.lawyer_name || "Unknown";
    document.getElementById("lawyer-specialization").textContent = lawyer.specialization || "General Practice";
    document.getElementById("lawyer-bio").textContent = lawyer.bio || "No bio available";
    document.getElementById("lawyer-contact").textContent = lawyer.contactNumber || "N/A";
    document.getElementById("lawyer-location").textContent = `${lawyer.district}, ${lawyer.province}`;

    // Handle appointment booking
    document.getElementById("book-appointment").addEventListener("click", function () {
      window.location.href = `book-appointment.html?lawyerId=${lawyer.id}`;
    });

    // Handle chat functionality
    document.getElementById("chat-now").addEventListener("click", function () {
      window.location.href = `chat.html?lawyerId=${lawyer.id}`;
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
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`HTTP ${response.status}: ${text || 'Unknown error'}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.code === 200 && data.data) {
          populateProfileForm(data.data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching profile:', error.message);
      });
  }
});
